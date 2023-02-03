from typing import Optional
from .. import models, schemas, oauth2 
from fastapi import HTTPException, Depends, APIRouter, status, Response
from sqlalchemy.orm import Session
from ..database import get_db

router = APIRouter(
    prefix = "/api/patrons",
    tags = ['Patrons']
)

# Get all patrons of a library
@router.get("/{id}")
def get_patrons_of_library(id: int,
                db: Session = Depends(get_db),
                limit: int = 10,
                skip: int = 0,
                search: Optional[str] = ""):
    query = db.query(models.Patron.user_id,
                    models.Patron.library_id, models.Patron.admin_level,
                    models.Patron.created_at, models.User.username).join(models.User, models.Patron.user_id == models.User.id, isouter=True).where(models.Patron.library_id == id)
    result = query.filter(models.User.username.contains(search)).limit(limit).offset(skip).all()
    return result

# Leave library
# You can only leave a library under the following conditions
# 1: the library exists
# 2: you are currently either a patron level of reader or author in that library
# 3: if so then you can delete the patron entry from the patrons table

@router.delete("/{id}")
def leave_library(id: int,
                db: Session = Depends(get_db),
                current_user: int = Depends(oauth2.get_current_user)):
    library_check = db.query(models.Library).filter(models.Library.id == id)
    library = library_check.first()
    if not library:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"library with id: {id} does not exist")
    # check if user is a patron of the library
    patron_query = db.query(models.Patron).filter(
        models.Patron.user_id==current_user.id,
        models.Patron.library_id==id, 
        (models.Patron.admin_level=="reader") | (models.Patron.admin_level=="author"))
    patron = patron_query.first()
    if not patron:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id: {current_user.id} is not a 'reader' or 'author' in library with id: {id}")
    patron_query.delete(synchronize_session=False)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)