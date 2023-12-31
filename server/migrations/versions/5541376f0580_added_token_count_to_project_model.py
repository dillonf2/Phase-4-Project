"""added token_count to project model

Revision ID: 5541376f0580
Revises: d46f7e870f32
Create Date: 2023-12-04 16:58:29.251577

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5541376f0580'
down_revision = 'd46f7e870f32'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('projects', schema=None) as batch_op:
        batch_op.add_column(sa.Column('token_count', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('projects', schema=None) as batch_op:
        batch_op.drop_column('token_count')

    # ### end Alembic commands ###
