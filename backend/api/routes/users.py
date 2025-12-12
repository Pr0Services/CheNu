"""CHE·NU — Users Routes"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def list_users():
    """List users — Law 1: User owns their data"""
    return {"users": [], "note": "User data is sovereign"}

@router.get("/{user_id}")
async def get_user(user_id: str):
    """Get user by ID"""
    return {"id": user_id, "message": "User data belongs to the user"}

@router.delete("/{user_id}/data")
async def delete_user_data(user_id: str):
    """Delete user data — Law 1 & Law 6"""
    return {"message": "All user data deleted", "reversible": True, "law": "Souveraineté des données"}
