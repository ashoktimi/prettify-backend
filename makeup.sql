\echo 'Delete and recreate makeup db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE makeup;
CREATE DATABASE makeup;
\connect makeup

\i makeup-schema.sql

\echo 'Delete and recreate  makeup_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE makeup_test;
CREATE DATABASE  makeup_test;
\connect  makeup_test

\i makeup-schema.sql
