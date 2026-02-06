const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Admin SDK if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

// --- CONFIGURATION ---
// PRODUCTION SECURITY FIX: Use Firebase Env Config
// Run: firebase functions:config:set admin.id="..." admin.password="..." admin.key="..."
const getAdminConfig = () => {
    // Graceful fallback or error if config is missing (helps debugging locally with mocks if needed, but strictly enforcing config for prod)
    if (!functions.config().admin) {
        console.error("FATAL: Admin config missing. Run firebase functions:config:set admin.id=... admin.password=... admin.key=...");
        return {};
    }
    return functions.config().admin;
};

// Hardcoded secret for token generation (In real app, use a strong secret in env)
const JWT_SECRET = "propvera-super-secret-key-998877";

// Helper to generate a simple token (mocking JWT for simplicity without extra deps if possible, 
// using a simple hash approach or just returning a static session key for this scope)
// We'll use a simple static token pattern for "server-side verification" as requested.
const SESSION_TOKEN = "admin-session-token-xy789";

// --- 1. ADMIN LOGIN ---
exports.adminLogin = functions.https.onCall(async (data, context) => {
    // 1. Validate Input Structure
    if (!data || !data.adminId || !data.password || !data.securityKey) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Missing credentials'
        );
    }

    const { adminId, password, securityKey } = data;
    const config = getAdminConfig();

    // 2. Logging for Debugging (NEVER LOG PASSWORDS)
    console.log(`Admin Login Attempt for ID: ${adminId}`);

    // 3. Strict Comparison with Env Config
    // Ensure all config values exist before comparing to avoid partial matches against undefined
    const configId = config.id;
    const configPass = config.password;
    const configKey = config.key;

    if (!configId || !configPass || !configKey) {
        console.error("Admin Login Failed: Server misconfiguration (missing env vars)");
        throw new functions.https.HttpsError(
            'internal',
            'Server authentication configuration error'
        );
    }

    if (
        adminId === configId &&
        password === configPass &&
        securityKey === configKey
    ) {
        console.log("Admin Login Success");
        return {
            success: true,
            role: "SUPER_ADMIN",
            token: SESSION_TOKEN
        };
    } else {
        console.warn("Admin Login Failed: Incorrect credentials");
        throw new functions.https.HttpsError(
            'permission-denied',
            'Invalid Admin Credentials'
        );
    }
});

// --- 2. GET ALL BUILDERS ---
exports.getAllBuilders = functions.https.onCall(async (data, context) => {
    const { token } = data;

    // Verify Token
    if (token !== SESSION_TOKEN) {
        throw new functions.https.HttpsError('unauthenticated', 'Invalid Admin Token');
    }

    try {
        const buildersRef = db.collection('builders');
        const snapshot = await buildersRef.get();

        const builders = [];
        snapshot.forEach(doc => {
            const d = doc.data();
            // Select only necessary summary fields
            builders.push({
                id: doc.id,
                name: d.name || 'Unknown',
                email: d.email || '-',
                plan: d.plan || 'free',
                totalProjects: d.totalProjects || 0,
                totalUnits: d.totalUnits || 0,
                createdAt: d.createdAt ? d.createdAt.toDate().toISOString() : null
            });
        });

        return { success: true, builders };
    } catch (error) {
        console.error("Error fetching builders:", error);
        throw new functions.https.HttpsError('internal', 'Failed to fetch builders');
    }
});

// --- 3. GET BUILDER DETAILS ---
exports.getBuilderDetails = functions.https.onCall(async (data, context) => {
    const { token, builderId } = data;

    if (token !== SESSION_TOKEN) {
        throw new functions.https.HttpsError('unauthenticated', 'Invalid Admin Token');
    }

    try {
        const builderDoc = await db.collection('builders').doc(builderId).get();
        if (!builderDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Builder not found');
        }

        const builderData = builderDoc.data();

        // Fetch Subcollections (Projects, Units)
        const projectsSnap = await db.collection('builders').doc(builderId).collection('projects').get();
        const projects = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt?.toDate().toISOString() }));

        const unitsSnap = await db.collection('builders').doc(builderId).collection('units').get();
        const units = unitsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return {
            success: true,
            builder: {
                ...builderData,
                id: builderId,
                createdAt: builderData.createdAt?.toDate().toISOString()
            },
            projects,
            units
        };

    } catch (error) {
        console.error("Error fetching builder details:", error);
        throw new functions.https.HttpsError('internal', 'ailed to fetch builder details');
    }
});

// Notifications (Existing)
const { sendEmail } = require('./notifications/sendEmail');
// ... (export existing functions if they were in index.js, assuming index.js handles exports)
