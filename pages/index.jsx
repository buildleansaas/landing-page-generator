import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import classNames from "classnames";
import axios from "axios";

import styles from "../styles/Home.module.css";
import { useEffect } from "react";

const PRODUCTS = [
  {
    test: {
      key: "prod_LlP82vwLfVC206",
    },
    production: {
      key: "prod_LlP82vwLfVC206",
    },
  },
];

export const THIS_ENV = process.env.NODE_ENV === "development" ? "test" : "prod";

export const getAllProductKeys = () =>
  Object.values(PRODUCTS)
    .map((p) => p[THIS_ENV].key)
    .filter(Boolean);

export default function Home({
  title,
  description,
  hook,
  subtitle,
  ctaText,
  ctaBackup,
  footerLink,
  companyName,
}) {
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      setProducts(
        await axios.get("/api/stripe/products", {
          params: { ids: getAllProductKeys() },
        })
      );
      setLoadingProducts(false);
    })();
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>{title ?? "Landing Page Generator Template!"}</title>
        <meta
          name="description"
          content={
            description ??
            "Manage and deploy infinite dynamic SaaS Prelaunch Pages with Nextjs + React + Sanity Headless CMS enhanced with Chakra UI!!!"
          }
        />
        {/* TODO: make favicon */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loadingProducts ? (
        <div className={styles.loader} />
      ) : (
        <>
          <main className={styles.main}>
            <h1 className={styles.title}>
              {hook ?? (
                <>
                  SaaS Prelaunch Pages <br />{" "}
                  <span style={{ color: "#48BB78" }}>Have Never Been Easier</span>
                </>
              )}
            </h1>
            <p className={styles.description}>
              {subtitle ??
                "Manage and deploy infinite dynamic landing pages with Nextjs + React + Sanity Headless CMS enhanced with Chakra UI!!!"}
            </p>
            <div className={styles.buttonContainer}>
              <a
                disabled={!products.length}
                className={classNames({
                  [styles.btn]: true,
                  [styles.btnPrimary]: true,
                })}
              >
                {ctaText ?? (
                  <>
                    Early Adopter Access for <strike>$50</strike> $5/year!
                  </>
                )}
              </a>
            </div>
            <p className={styles.textMuted}>
              {ctaBackup ?? (
                <span style={{ textAlign: "center" }}>
                  This pricing tier is only available to the <u>next 100 users</u>!
                </span>
              )}
            </p>
          </main>
          <footer className={styles.footer}>
            <a
              className={styles.textMuted}
              href={footerLink ?? "https://buildleansaas.com"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textTransform: "uppercase",
                fontWeight: 400,
              }}
            >
              Powered by {companyName}
              <span className={styles.logo} style={{ marginLeft: "0.5rem" }}>
                <Image
                  src="/bls.png"
                  alt={`${companyName ?? "Build Lean SaaS "} Logo`}
                  width={32}
                  height={32}
                />
              </span>
            </a>
          </footer>
        </>
      )}
    </div>
  );
}
