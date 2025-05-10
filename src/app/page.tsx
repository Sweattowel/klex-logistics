'use client'

import { useEffect, useState } from "react";
import Foot from "./Global/Foot";
import Nav from "./Global/Nav";

export default function Home() {

  return (
    <main>
      <Nav />
        <section>
          Main Page
        </section>
      <Foot />
    </main>
  );
};