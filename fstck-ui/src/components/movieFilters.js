'use client';

import {Field, Form, Formik} from "formik";

export default function MovieFilters({ onSubmit, filters }) {

  return (
    <>
      <Formik initialValues={filters} onSubmit={onSubmit}>
        <Form>
          <label htmlFor="firstName">IMDB rating, GTE</label>
          <Field id="imdb" name="IMDB" placeholder="8" />

          <label htmlFor="lastName">Reviews count</label>
          <Field id="reviewCount" name="reviewCount" placeholder="10000" />

          <label htmlFor="email">Year, GTE</label>
          <Field
            id="yearStart"
            name="yearStart"
            placeholder="1980"
          />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </>
  );
}