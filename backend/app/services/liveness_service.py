import random
from typing import Dict, Tuple

def process_face_liveness(straight_image: str, left_image: str = None, right_image: str = None) -> Tuple[bool, float, str]:
    """
    Simulates Biometric Face Liveness and Head-Turn Angle checks (Coincircletrust API).
    Returns (verified, liveness_score, message)
    """
    if not straight_image:
        return False, 0.0, "Straight face image is required."
        
    # High confidence score for realistic feedback
    score = round(random.uniform(97.2, 99.8), 1)
    
    has_angles = bool(left_image and right_image)
    if has_angles:
        msg = f"3-Pose Biometric Liveness verified ({score}% confidence match). Anti-spoofing checks passed."
    else:
        msg = f"Primary Face Liveness verified ({score}% match)."
        
    return True, score, msg
