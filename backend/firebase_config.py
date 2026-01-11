import firebase_admin
from firebase_admin import credentials, auth
from django.conf import settings

# Initialize Firebase Admin SDK only if credentials path is valid
if hasattr(settings, 'FIREBASE_CREDENTIALS_PATH') and settings.FIREBASE_CREDENTIALS_PATH and settings.FIREBASE_CREDENTIALS_PATH != 'path/to/your/firebase/serviceAccountKey.json':
    try:
        cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred)
        FIREBASE_INITIALIZED = True
    except Exception as e:
        print(f"Firebase initialization failed: {e}")
        FIREBASE_INITIALIZED = False
else:
    print("Firebase credentials not configured. Firebase features will be disabled.")
    FIREBASE_INITIALIZED = False

def verify_firebase_token(id_token):
    if not FIREBASE_INITIALIZED:
        print("Firebase not initialized. Token verification skipped.")
        return None

    try:
        # Remove 'Bearer ' prefix if present
        if id_token.startswith('Bearer '):
            id_token = id_token[7:]
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print(f"Token verification failed: {e}")
        return None
