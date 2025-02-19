--
-- PostgreSQL database dump
--

-- Dumped from database version 17.3 (Debian 17.3-3.pgdg120+1)
-- Dumped by pg_dump version 17.3

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: file_system; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.file_system (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    parent_id uuid,
    name text NOT NULL
);


ALTER TABLE public.file_system OWNER TO admin;

--
-- Data for Name: file_system; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.file_system (id, parent_id, name) FROM stdin;
75676295-4516-45ef-aae6-4a403790a77a	\N	system management
0cd381f9-b543-4bc0-8973-41b02c73d545	75676295-4516-45ef-aae6-4a403790a77a	System Management
a09605b9-c4a4-41ea-acaa-727fb7f4f530	0cd381f9-b543-4bc0-8973-41b02c73d545	Systems
62c5a178-9aeb-4aa5-8748-e2066c543787	a09605b9-c4a4-41ea-acaa-727fb7f4f530	System Code
9ab8ee84-abd8-4215-88e5-0194af5768fb	62c5a178-9aeb-4aa5-8748-e2066c543787	Code Registration
8ffac3a1-e686-4544-83fb-a9cf5044c460	a09605b9-c4a4-41ea-acaa-727fb7f4f530	Code Registration -2
b6939b9c-e059-418f-bbc4-8409db444c96	a09605b9-c4a4-41ea-acaa-727fb7f4f530	Properties
2afdce28-bcb9-4887-9e12-614b02502b89	a09605b9-c4a4-41ea-acaa-727fb7f4f530	Menus
6d2042c4-7b0f-4d93-8326-2472f2931fb5	2afdce28-bcb9-4887-9e12-614b02502b89	Menu Registration
fd25504c-2836-4ede-a272-65c33ce1df2d	a09605b9-c4a4-41ea-acaa-727fb7f4f530	APIList 
38a46378-bf7a-48f4-8ca6-1159ec4baaa8	fd25504c-2836-4ede-a272-65c33ce1df2d	API Registration
1f9061bf-33c0-4723-9380-4142201a3aab	fd25504c-2836-4ede-a272-65c33ce1df2d	API Edit
7a933c55-bada-4bfe-9408-5ba7c74f33b6	a9854145-65fa-4afc-96c1-0eebce63bf07	Users
52c8ad21-d512-4797-bf69-8f51fb87323d	7a933c55-bada-4bfe-9408-5ba7c74f33b6	User Account Registration
c54fd1b0-7e3a-46ae-87fe-76e60df4355b	a9854145-65fa-4afc-96c1-0eebce63bf07	Groups
c8cd67ec-8704-46dd-8722-221cb79b8546	c54fd1b0-7e3a-46ae-87fe-76e60df4355b	User Group Registration
17cfad32-7f18-4c72-a1da-619c0d99f7e4	a9854145-65fa-4afc-96c1-0eebce63bf07	사용자 승인
81dcccbc-9583-4905-a57b-bf4d94240ea0	17cfad32-7f18-4c72-a1da-619c0d99f7e4	사용자 승인 상세
a9854145-65fa-4afc-96c1-0eebce63bf07	75676295-4516-45ef-aae6-4a403790a77a	Users & Groups
10ad38ca-aa66-4c19-a8f3-368ff389c906	75676295-4516-45ef-aae6-4a403790a77a	lulu duc
\.


--
-- Name: file_system file_system_pk; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.file_system
    ADD CONSTRAINT file_system_pk PRIMARY KEY (id);


--
-- Name: file_system file_system_file_system_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.file_system
    ADD CONSTRAINT file_system_file_system_id_fk FOREIGN KEY (parent_id) REFERENCES public.file_system(id);


--
-- PostgreSQL database dump complete
--

