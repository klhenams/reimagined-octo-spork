from fastapi import APIRouter

from rms.config import get_settings
from rms.database.core import database_connection_pool
from rms.dependencies.auth import AuthenticatedSuperAdmin

router = APIRouter(prefix="/mmdas")

settings = get_settings()


def log_notice(diag):
    print(f"The server says: {diag.severity} - {diag.message_primary}")


@router.post("")
async def add_mmda(
    name: str,
    super_admin: AuthenticatedSuperAdmin,
):
    async with database_connection_pool.connection() as connection:
        connection.add_notice_handler(log_notice)
        await connection.execute(f"SET search_path TO {name}")
        await connection.execute(
            """           
            CREATE TYPE property_class AS ENUM (
                'RESIDENTIAL',
                'COMMERCIAL',
                'INDUSTRIAL',
                'AGRICULTURAL',
                'MIXED_USE'
            );

            CREATE TYPE property_category AS ENUM (
                'SINGLE_FAMILY',
                'MULTI_FAMILY',
                'APARTMENT',
                'OFFICE',
                'RETAIL',
                'WAREHOUSE',
                'MANUFACTURING',
                'FARMLAND'
            );

            CREATE TYPE payment_type AS ENUM (
                'monthly',
                'quarterly',
                'annual'
            );

            CREATE TYPE user_title AS ENUM (
                'Mr.',
                'Mrs.',
                'Miss'
            );
            """
        )
        await connection.execute(
            """
            CREATE TABLE IF NOT EXISTS users
            (
                id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                tax_identification_number BIGINT UNIQUE, -- MUST BE 11 DIGITS
                title                     USER_TITLE,
                surname                   TEXT,
                other_names               TEXT,
                address                   TEXT,
                digital_address           TEXT,
                phone_number              TEXT UNIQUE,
                email                     TEXT UNIQUE,
                national_id               TEXT UNIQUE
            );

            CREATE TABLE IF NOT EXISTS properties
            (
                id                           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                owner_id                     UUID REFERENCES users,
                class_                        PROPERTY_CLASS    NOT NULL,
                category                     PROPERTY_CATEGORY NOT NULL,
                payment_type                 PAYMENT_TYPE      NOT NULL,
                zone                         INTEGER           NOT NULL,
                number_of_rooms              INTEGER,
                is_excluded_from_rating      BOOLEAN          DEFAULT FALSE,
                physical_address             TEXT,
                unique_parcel_number         INTEGER              NOT NULL,
                unique_parcel_number_subunit TEXT,
                locality_code                TEXT,
                street_name                  TEXT,
                property_number              TEXT, -- AKA house number
                year_of_construction         INTEGER,
                number_of_people_in_building INTEGER CHECK (number_of_people_in_building >= 0 ),
                roofing                      TEXT,
                comment                      TEXT,
                current_value                INTEGER,
                current_impost               NUMERIC,
                payment_amount_due           NUMERIC,
                arrears                      NUMERIC,
                revenue_collected            NUMERIC,
                is_payment_status_due        BOOLEAN
            );

            CREATE TABLE IF NOT EXISTS businesses (
                id BIGSERIAL PRIMARY KEY,
                reference BIGSERIAL,
                name TEXT,
                owner_id UUID,
                is_active BOOLEAN,
                business_class TEXT,
                da_assigned_number TEXT,
                establishment_year INT,
                certificate TEXT,
                permit_number TEXT,
                tax_identification_number TEXT,
                number_of_employees INT,
                comments TEXT
            );
            
            CREATE TABLE IF NOT EXISTS property_revenue
            (
                property_id UUID REFERENCES properties,
                entry_date  DATE DEFAULT CURRENT_DATE,
                collector   UUID REFERENCES users,
                amount_paid NUMERIC NOT NULL
            --     payment_type
            );
        """
        )
        tables = await connection.execute(
            """
            SELECT table_name, table_schema
            FROM information_schema.tables
            WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
            """
        )
        async for table in tables:
            print(table)

        return {"message": "MMDA successfully added to system."}

        await connection.rollback()
