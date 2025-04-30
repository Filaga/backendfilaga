--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: transaction_status; Type: TYPE; Schema: public; Owner: filaga
--

CREATE TYPE public.transaction_status AS ENUM (
    'pending',
    'paid'
);


ALTER TYPE public.transaction_status OWNER TO filaga;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: items; Type: TABLE; Schema: public; Owner: filaga
--

CREATE TABLE public.items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    price integer NOT NULL,
    store_id uuid NOT NULL,
    image_url character varying(255),
    stock integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.items OWNER TO filaga;

--
-- Name: stores; Type: TABLE; Schema: public; Owner: filaga
--

CREATE TABLE public.stores (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stores OWNER TO filaga;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: filaga
--

CREATE TABLE public.transactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    item_id uuid NOT NULL,
    quantity integer NOT NULL,
    total integer NOT NULL,
    status public.transaction_status DEFAULT 'pending'::public.transaction_status,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transactions OWNER TO filaga;

--
-- Name: users; Type: TABLE; Schema: public; Owner: filaga
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    balance integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO filaga;

--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: filaga
--

COPY public.items (id, name, price, store_id, image_url, stock, created_at) FROM stdin;
80f42526-669e-4672-8b8c-d94c6b50844d	lanyard	100000	ba8f810d-032b-406a-abe3-b63ea1a46fdf	http://sbd-zipline.egfnve.easypanel.host/u/5gT3uS.jpg	2	2025-03-19 08:02:32.04059
\.


--
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: filaga
--

COPY public.stores (id, name, address, created_at) FROM stdin;
ba8f810d-032b-406a-abe3-b63ea1a46fdf	UI Store Engineering	Kota tercinta Depok, FTUI	2025-03-12 06:28:18.940327
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: filaga
--

COPY public.transactions (id, user_id, item_id, quantity, total, status, created_at) FROM stdin;
5b767286-ec68-47c4-b2fd-a23ca8c8fb37	376246cd-1709-4b7f-8af4-c68c9b07bfb1	80f42526-669e-4672-8b8c-d94c6b50844d	1	100000	paid	2025-03-19 08:40:08.799066
f53ee652-fe7e-4ea6-b142-51b3cc0dd644	376246cd-1709-4b7f-8af4-c68c9b07bfb1	80f42526-669e-4672-8b8c-d94c6b50844d	1	100000	paid	2025-03-19 08:45:44.515115
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: filaga
--

COPY public.users (id, name, email, password, balance, created_at) FROM stdin;
2d4ff3e4-87b5-412e-a214-5ce77296b320	netlab	netlab@mail.com	$2b$10$8fm4MQYxNeWjycrl3P4V4Oih1MRUjVE497TOenRq0c01XMLl1vHpq	0	2025-03-19 07:14:55.570305
376246cd-1709-4b7f-8af4-c68c9b07bfb1	William Iskandar Updated	netlabupdated@mail.com	$2b$10$GSVoHrDTKlQDhvj1KBQbSuAHZvH1IKJrah01jUak73I0cGQCnnsI.	100000	2025-03-19 06:40:02.966598
\.


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: filaga
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: stores stores_pkey; Type: CONSTRAINT; Schema: public; Owner: filaga
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: filaga
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: filaga
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: filaga
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: items items_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: filaga
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: filaga
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: filaga
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

