-- czyszczenie wszystkich danych
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    )
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' 
        || quote_ident(r.tablename) 
        || ' CASCADE';
    END LOOP;
END $$;

CREATE TABLE SPRING_SESSION (
    PRIMARY_ID CHAR(36) NOT NULL,
    SESSION_ID CHAR(36) NOT NULL,
    CREATION_TIME BIGINT NOT NULL,
    LAST_ACCESS_TIME BIGINT NOT NULL,
    MAX_INACTIVE_INTERVAL INT NOT NULL,
    EXPIRY_TIME BIGINT NOT NULL,
    PRINCIPAL_NAME VARCHAR(100),
    CONSTRAINT SPRING_SESSION_PK PRIMARY KEY (PRIMARY_ID)
);

CREATE UNIQUE INDEX SPRING_SESSION_IX1 ON SPRING_SESSION (SESSION_ID);
CREATE INDEX SPRING_SESSION_IX2 ON SPRING_SESSION (EXPIRY_TIME);
CREATE INDEX SPRING_SESSION_IX3 ON SPRING_SESSION (PRINCIPAL_NAME);

CREATE TABLE SPRING_SESSION_ATTRIBUTES (
    SESSION_PRIMARY_ID CHAR(36) NOT NULL,
    ATTRIBUTE_NAME VARCHAR(200) NOT NULL,
    ATTRIBUTE_BYTES BYTEA NOT NULL,
    CONSTRAINT SPRING_SESSION_ATTRIBUTES_PK PRIMARY KEY (SESSION_PRIMARY_ID, ATTRIBUTE_NAME),
    CONSTRAINT SPRING_SESSION_ATTRIBUTES_FK FOREIGN KEY (SESSION_PRIMARY_ID) REFERENCES SPRING_SESSION(PRIMARY_ID) ON DELETE CASCADE
);

CREATE TABLE account_types(
	id SERIAL PRIMARY KEY,
	name VARCHAR(30)
);

-- <> WARTOŚCI ACOUNT TYPES <> --

INSERT INTO account_types(id,name) VALUES 
(0,'user'),
(1,'cocker'),
(2,'klerk'),
(3,'deliverer'),
(4,'unactivated'),
(5,'deactivated'),
(6,'admin')
ON CONFLICT (id) DO NOTHING;

-- <> WARTOŚCI ACOUNT TYPES <> --

CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	name VARCHAR(25), 
	surname VARCHAR(30), 
	email VARCHAR(60) UNIQUE, 
	password VARCHAR(255),
	account_type_id Integer REFERENCES account_types(id)
);

-- <> WARTOŚCI DISCOUNT TYPES <> --

INSERT INTO discount_types(id,name) VALUES 
(0,'flat'),
(1,'percentage')
ON CONFLICT (id) DO NOTHING;

-- <> WARTOŚCI DISCOUNT TYPES <> --

CREATE TABLE cupons (
	id SERIAL PRIMARY KEY,
	name VARCHAR(15), 
	minimal_total INTEGER,
	discount INTEGER,
	discount_type_id Integer REFERENCES discount_types(id),
	uses INTEGER,
	time_of_life TIMESTAMP
);

-- items

CREATE TABLE ingredients (
	id SERIAL PRIMARY KEY,
	name VARCHAR(30),
	price INTEGER,
	listed BOOLEAN
);

CREATE TABLE drinks (
	id SERIAL PRIMARY KEY,
	name VARCHAR(30),
	price INTEGER,
	listed BOOLEAN
);

CREATE TABLE pizzas (
	id SERIAL PRIMARY KEY,
	name VARCHAR(30),
	price INTEGER,
	listed BOOLEAN
);

CREATE TABLE contents (
	id SERIAL PRIMARY KEY,
	ingredient_id Integer REFERENCES ingredients(id),
	pizza_id Integer REFERENCES pizzas(id)
);

CREATE TABLE pizza_queue (
	id SERIAL PRIMARY KEY,
	user_id Integer REFERENCES users(id),
	pizza Integer REFERENCES pizzas(id)
);

-- order

CREATE TABLE status (
	id SERIAL PRIMARY KEY,
	name VARCHAR(20)
);

-- <> WARTOŚCI STATUS <> --

INSERT INTO status(id,name) VALUES 
(0,'ordered'),
(1,'in progress'),
(2,'in delivery'),
(3,'finished'),
(4,'compleated')
ON CONFLICT (id) DO NOTHING;

-- <> WARTOŚCI STATUS <> --

CREATE TABLE delivery_methods (
	id SERIAL PRIMARY KEY,
	name VARCHAR(20)
);

-- <> WARTOŚCI DELIVERY METHODS <> --

INSERT INTO delivery_methods(id,name) VALUES 
(0,'in-store pickup'),
(1,'local delivery')
ON CONFLICT (id) DO NOTHING;

-- <> WARTOŚCI DELIVERY METHODS <> --

CREATE TABLE payment_methods (
	id SERIAL PRIMARY KEY,
	name VARCHAR(30)
);

-- <> WARTOŚCI PAYMENT METHODS <> --

INSERT INTO payment_methods(id,name) VALUES 
(0,'credit card'),
(1,'cash')
ON CONFLICT (id) DO NOTHING;

-- <> WARTOŚCI PAYMENT METHODS <> --

CREATE TABLE delivery_adress (
	id SERIAL PRIMARY KEY,
	adress VARCHAR(20) UNIQUE
);

CREATE TABLE orders (
	id SERIAL PRIMARY KEY,
	user_id Integer REFERENCES users(id),
	order_time TIMESTAMP,
	delivery_time TIMESTAMP,
	total INTEGER,
	status_id Integer REFERENCES status(id),
	delivery_method_id Integer REFERENCES delivery_methods(id),
	payment_method_id Integer REFERENCES payment_methods(id),
	delivery_adress_id Integer REFERENCES delivery_adress(id)
	cupon_id Integer REFERENCES cupons(id),
);

-- to --> order relations

CREATE TABLE delivery_task (
	id SERIAL PRIMARY KEY,
	user_id Integer REFERENCES users(id),
	order_id Integer REFERENCES orders(id)
);

CREATE TABLE ordered_pizza (
	id SERIAL PRIMARY KEY,
	order_id Integer REFERENCES orders(id),
	pizza_id Integer REFERENCES pizzas(id)
);

CREATE TABLE ordered_drink (
	id SERIAL PRIMARY KEY,
	order_id Integer REFERENCES orders(id),
	drink_id Integer REFERENCES drinks(id)
);
