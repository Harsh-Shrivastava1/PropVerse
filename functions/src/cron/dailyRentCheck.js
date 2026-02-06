const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { sendEmail } = require("../notifications/sendEmail");

const db = admin.firestore();

exports.dailyRentCheck = functions.pubsub.schedule("every 24 hours").onRun(async (context) => {
    const buildersSnap = await db.collection("builders").get();
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const batch = db.batch();

    for (const builderDoc of buildersSnap.docs) {
        const builderId = builderDoc.id;
        const builderData = builderDoc.data();

        // --- 1. RENT CHECK ---
        const unitsRef = db.collection("builders").doc(builderId).collection("units");
        const rentedUnitsSnap = await unitsRef.where("status", "==", "Rented").get();

        for (const unitDoc of rentedUnitsSnap.docs) {
            const unit = unitDoc.data();
            const rentDueDay = unit.tenant?.rentDueDay || 1;

            // Check for Due Today
            if (rentDueDay === currentDay) {
                // Send Reminder
                await sendEmail(builderData.email, `Rent Due: Unit ${unit.unitNumber}`, `Rent for unit ${unit.unitNumber} is due today.`);

                const notifRef = db.collection("builders").doc(builderId).collection("notifications").doc();
                batch.set(notifRef, {
                    title: "Rent Due",
                    message: `Rent for Unit ${unit.unitNumber} is due today.`,
                    read: false,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });
            }

            // Check for Overdue (Rent Due Day passed, no payment found)
            // Logic: query 'rents' collection for this unitId in current month/year.
            // Optimised: This can be heavy. We will simplify: 
            // If today is rentDueDay + 1, check if paid.
            if (currentDay === rentDueDay + 1) {
                // Check payment
                const startOfMonth = new Date(currentYear, currentMonth, 1);
                const rentsRef = db.collection("builders").doc(builderId).collection("rents");
                const paymentSnap = await rentsRef
                    .where("unitId", "==", unitDoc.id)
                    .where("createdAt", ">=", startOfMonth)
                    .limit(1)
                    .get();

                if (paymentSnap.empty) {
                    // Overdue!
                    const notifRef = db.collection("builders").doc(builderId).collection("notifications").doc();
                    batch.set(notifRef, {
                        title: "Rent OVERDUE",
                        message: `Rent for Unit ${unit.unitNumber} is overdue!`,
                        read: false,
                        type: 'alert',
                        createdAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                    await sendEmail(builderData.email, `OVERDUE: Unit ${unit.unitNumber}`, `Rent for unit ${unit.unitNumber} is OVERDUE.`);
                }
            }
        }

        // --- 2. DAILY USAGE (BILLING) ---
        // Count ALL units
        const allUnitsSnap = await unitsRef.get(); // Currently gets all units again, optimization: reuse snapshot if possible or separate query
        const totalUnits = allUnitsSnap.size;
        const dailyCost = totalUnits * 2; // ₹2 per flat

        const usageRef = db.collection("builders").doc(builderId).collection("billing_usage").doc(`${currentYear}-${currentMonth}-${currentDay}`);
        batch.set(usageRef, {
            date: admin.firestore.FieldValue.serverTimestamp(),
            unitCount: totalUnits,
            cost: dailyCost
        });
    }

    await batch.commit();
    console.log("Daily check completed");
});
