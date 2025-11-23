

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_default_shipping_address"("address_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE shipping_details SET is_default = false WHERE user_id = auth.uid();
  UPDATE shipping_details SET is_default = true WHERE id = address_id AND user_id = auth.uid();
END;
$$;


ALTER FUNCTION "public"."set_default_shipping_address"("address_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_modified_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_modified_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."cart_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "product_id" "uuid",
    "size_id" "uuid",
    "quantity" integer NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "cart_items_quantity_check" CHECK (("quantity" > 0))
);


ALTER TABLE "public"."cart_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."checkout" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "status" "text" DEFAULT 'pending'::"text",
    "total_amount" numeric(10,2) DEFAULT 0,
    "created_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "checkout_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."checkout" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."checkout_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "checkout_id" "uuid",
    "product_id" "uuid",
    "size_id" "uuid",
    "quantity" integer NOT NULL,
    "price" numeric(10,2),
    CONSTRAINT "checkout_items_price_check" CHECK (("price" >= (0)::numeric)),
    CONSTRAINT "checkout_items_quantity_check" CHECK (("quantity" > 0))
);


ALTER TABLE "public"."checkout_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid",
    "product_id" "uuid",
    "size_id" "uuid",
    "quantity" integer NOT NULL,
    "price" numeric(10,2),
    CONSTRAINT "order_items_price_check" CHECK (("price" >= (0)::numeric)),
    CONSTRAINT "order_items_quantity_check" CHECK (("quantity" > 0))
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "total_amount" numeric(10,2) NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "orders_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'paid'::"text", 'shipped'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "order_id" "uuid",
    "mpesa_receipt" "text",
    "amount" numeric(10,2),
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "payments_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'success'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_sizes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid",
    "size_grams" integer NOT NULL,
    "price" numeric(10,2),
    "stock_quantity" integer DEFAULT 0,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "product_sizes_price_check" CHECK (("price" >= (0)::numeric)),
    CONSTRAINT "product_sizes_size_grams_check" CHECK (("size_grams" = ANY (ARRAY[5, 10, 50, 100, 250, 500, 1000])))
);


ALTER TABLE "public"."product_sizes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "price" numeric(10,2),
    "image_url" "text",
    "category" "text" NOT NULL,
    "stock_quantity" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "products_category_check" CHECK (("category" = ANY (ARRAY['hormonal_balance'::"text", 'energy'::"text", 'sleep'::"text", 'wellness'::"text"]))),
    CONSTRAINT "products_price_check" CHECK (("price" >= (0)::numeric))
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "email" "text",
    "role" "text" DEFAULT 'user'::"text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "profiles_role_check" CHECK (("role" = ANY (ARRAY['user'::"text", 'admin'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."shipping_details" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "address_line" "text" NOT NULL,
    "city" "text",
    "country" "text",
    "postal_code" "text",
    "phone_number" "text",
    "is_default" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."shipping_details" OWNER TO "postgres";


ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."checkout_items"
    ADD CONSTRAINT "checkout_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."checkout"
    ADD CONSTRAINT "checkout_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_sizes"
    ADD CONSTRAINT "product_sizes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."shipping_details"
    ADD CONSTRAINT "shipping_details_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_cart_items_user_id" ON "public"."cart_items" USING "btree" ("user_id");



CREATE INDEX "idx_checkout_user_id" ON "public"."checkout" USING "btree" ("user_id");



CREATE INDEX "idx_orders_user_id" ON "public"."orders" USING "btree" ("user_id");



CREATE INDEX "idx_payments_order_id" ON "public"."payments" USING "btree" ("order_id");



CREATE INDEX "idx_product_sizes_product_id" ON "public"."product_sizes" USING "btree" ("product_id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "public"."product_sizes"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."checkout_items"
    ADD CONSTRAINT "checkout_items_checkout_id_fkey" FOREIGN KEY ("checkout_id") REFERENCES "public"."checkout"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."checkout_items"
    ADD CONSTRAINT "checkout_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."checkout_items"
    ADD CONSTRAINT "checkout_items_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "public"."product_sizes"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."checkout"
    ADD CONSTRAINT "checkout_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "public"."product_sizes"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."product_sizes"
    ADD CONSTRAINT "product_sizes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."shipping_details"
    ADD CONSTRAINT "shipping_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE "public"."cart_items" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "cart_items_policy" ON "public"."cart_items" USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."checkout" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."checkout_items" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "checkout_items_policy" ON "public"."checkout_items" USING ((EXISTS ( SELECT 1
   FROM "public"."checkout"
  WHERE (("checkout"."id" = "checkout_items"."checkout_id") AND ("checkout"."user_id" = "auth"."uid"())))));



CREATE POLICY "checkout_policy" ON "public"."checkout" USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "orders_policy" ON "public"."orders" USING ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text"))))));



ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "payments_insert_policy" ON "public"."payments" FOR INSERT TO "service_role" WITH CHECK (true);



CREATE POLICY "payments_select_policy" ON "public"."payments" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM "public"."orders"
  WHERE (("orders"."id" = "payments"."order_id") AND ("orders"."user_id" = "auth"."uid"())))) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text"))))));



ALTER TABLE "public"."product_sizes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "product_sizes_manage_policy" ON "public"."product_sizes" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "product_sizes_select_policy" ON "public"."product_sizes" FOR SELECT USING (((EXISTS ( SELECT 1
   FROM "public"."products"
  WHERE (("products"."id" = "product_sizes"."product_id") AND ("products"."is_active" = true)))) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text"))))));



ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "products_manage_policy" ON "public"."products" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "products_select_policy" ON "public"."products" FOR SELECT USING ((("is_active" = true) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text"))))));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_select_policy" ON "public"."profiles" FOR SELECT USING ((("id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."profiles" "profiles_1"
  WHERE (("profiles_1"."id" = "auth"."uid"()) AND ("profiles_1"."role" = 'admin'::"text"))))));



CREATE POLICY "profiles_update_policy" ON "public"."profiles" FOR UPDATE USING ((("id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."profiles" "profiles_1"
  WHERE (("profiles_1"."id" = "auth"."uid"()) AND ("profiles_1"."role" = 'admin'::"text"))))));



ALTER TABLE "public"."shipping_details" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "shipping_details_policy" ON "public"."shipping_details" USING (("user_id" = "auth"."uid"()));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_default_shipping_address"("address_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."set_default_shipping_address"("address_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_default_shipping_address"("address_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."cart_items" TO "anon";
GRANT ALL ON TABLE "public"."cart_items" TO "authenticated";
GRANT ALL ON TABLE "public"."cart_items" TO "service_role";



GRANT ALL ON TABLE "public"."checkout" TO "anon";
GRANT ALL ON TABLE "public"."checkout" TO "authenticated";
GRANT ALL ON TABLE "public"."checkout" TO "service_role";



GRANT ALL ON TABLE "public"."checkout_items" TO "anon";
GRANT ALL ON TABLE "public"."checkout_items" TO "authenticated";
GRANT ALL ON TABLE "public"."checkout_items" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."product_sizes" TO "anon";
GRANT ALL ON TABLE "public"."product_sizes" TO "authenticated";
GRANT ALL ON TABLE "public"."product_sizes" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."shipping_details" TO "anon";
GRANT ALL ON TABLE "public"."shipping_details" TO "authenticated";
GRANT ALL ON TABLE "public"."shipping_details" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























drop extension if exists "pg_net";

drop policy "checkout_items_policy" on "public"."checkout_items";

drop policy "orders_policy" on "public"."orders";

drop policy "payments_select_policy" on "public"."payments";

drop policy "product_sizes_manage_policy" on "public"."product_sizes";

drop policy "product_sizes_select_policy" on "public"."product_sizes";

drop policy "products_manage_policy" on "public"."products";

drop policy "products_select_policy" on "public"."products";

drop policy "profiles_select_policy" on "public"."profiles";

drop policy "profiles_update_policy" on "public"."profiles";

alter table "public"."cart_items" drop constraint "cart_items_product_id_fkey";

alter table "public"."cart_items" drop constraint "cart_items_size_id_fkey";

alter table "public"."checkout_items" drop constraint "checkout_items_checkout_id_fkey";

alter table "public"."checkout_items" drop constraint "checkout_items_product_id_fkey";

alter table "public"."checkout_items" drop constraint "checkout_items_size_id_fkey";

alter table "public"."order_items" drop constraint "order_items_order_id_fkey";

alter table "public"."order_items" drop constraint "order_items_product_id_fkey";

alter table "public"."order_items" drop constraint "order_items_size_id_fkey";

alter table "public"."payments" drop constraint "payments_order_id_fkey";

alter table "public"."product_sizes" drop constraint "product_sizes_product_id_fkey";

alter table "public"."cart_items" add constraint "cart_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."cart_items" validate constraint "cart_items_product_id_fkey";

alter table "public"."cart_items" add constraint "cart_items_size_id_fkey" FOREIGN KEY (size_id) REFERENCES public.product_sizes(id) ON DELETE SET NULL not valid;

alter table "public"."cart_items" validate constraint "cart_items_size_id_fkey";

alter table "public"."checkout_items" add constraint "checkout_items_checkout_id_fkey" FOREIGN KEY (checkout_id) REFERENCES public.checkout(id) ON DELETE CASCADE not valid;

alter table "public"."checkout_items" validate constraint "checkout_items_checkout_id_fkey";

alter table "public"."checkout_items" add constraint "checkout_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."checkout_items" validate constraint "checkout_items_product_id_fkey";

alter table "public"."checkout_items" add constraint "checkout_items_size_id_fkey" FOREIGN KEY (size_id) REFERENCES public.product_sizes(id) ON DELETE SET NULL not valid;

alter table "public"."checkout_items" validate constraint "checkout_items_size_id_fkey";

alter table "public"."order_items" add constraint "order_items_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE not valid;

alter table "public"."order_items" validate constraint "order_items_order_id_fkey";

alter table "public"."order_items" add constraint "order_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."order_items" validate constraint "order_items_product_id_fkey";

alter table "public"."order_items" add constraint "order_items_size_id_fkey" FOREIGN KEY (size_id) REFERENCES public.product_sizes(id) ON DELETE SET NULL not valid;

alter table "public"."order_items" validate constraint "order_items_size_id_fkey";

alter table "public"."payments" add constraint "payments_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE not valid;

alter table "public"."payments" validate constraint "payments_order_id_fkey";

alter table "public"."product_sizes" add constraint "product_sizes_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE not valid;

alter table "public"."product_sizes" validate constraint "product_sizes_product_id_fkey";


  create policy "checkout_items_policy"
  on "public"."checkout_items"
  as permissive
  for all
  to public
using ((EXISTS ( SELECT 1
   FROM public.checkout
  WHERE ((checkout.id = checkout_items.checkout_id) AND (checkout.user_id = auth.uid())))));



  create policy "orders_policy"
  on "public"."orders"
  as permissive
  for all
  to public
using (((user_id = auth.uid()) OR public.is_admin()));



  create policy "payments_select_policy"
  on "public"."payments"
  as permissive
  for select
  to public
using (((EXISTS ( SELECT 1
    FROM public.orders
  WHERE ((orders.id = payments.order_id) AND (orders.user_id = auth.uid())))) OR public.is_admin()));



  create policy "product_sizes_manage_policy"
  on "public"."product_sizes"
  as permissive
  for all
  to public
using (public.is_admin());



  create policy "product_sizes_select_policy"
  on "public"."product_sizes"
  as permissive
  for select
  to public
using (((EXISTS ( SELECT 1
    FROM public.products
  WHERE ((products.id = product_sizes.product_id) AND (products.is_active = true)))) OR public.is_admin()));



  create policy "products_manage_policy"
  on "public"."products"
  as permissive
  for all
  to public
using (public.is_admin());



  create policy "products_select_policy"
  on "public"."products"
  as permissive
  for select
  to public
using (((is_active = true) OR public.is_admin()));



  create policy "profiles_select_policy"
  on "public"."profiles"
  as permissive
  for select
  to public
using (((id = auth.uid()) OR public.is_admin()));



  create policy "profiles_update_policy"
  on "public"."profiles"
  as permissive
  for update
  to public
using (((id = auth.uid()) OR public.is_admin()));


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


