"""changed relationship name in project table from nfts to project_nfts

Revision ID: 83af3e695eb3
Revises: 77cbaccf0a70
Create Date: 2023-12-06 15:42:58.437807

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '83af3e695eb3'
down_revision = '77cbaccf0a70'
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
