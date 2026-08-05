import type * as React from "react";

import styles from "./docs.module.css";

export interface TokenEntry {
  name: string;
  value: string;
}

/**
 * Swatches for colour tokens.
 *
 * The swatch is `aria-hidden` and the token name is real text, so the list is
 * usable without seeing the colour at all.
 */
export function TokenPreview({ tokens }: { tokens: TokenEntry[] }): React.JSX.Element {
  return (
    <ul className={styles.tokenGrid}>
      {tokens.map((token) => (
        <li className={styles.token} key={token.name}>
          <span
            className={styles.tokenSwatch}
            style={{ backgroundColor: `var(${token.name})` }}
            aria-hidden="true"
          />
          <span className={styles.tokenMeta}>
            <code className={styles.tokenName}>{token.name}</code>
            <span className={styles.tokenValue}>{token.value}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Scale tokens shown as proportional bars — spacing, radii, type sizes. */
export function ScalePreview({
  tokens,
  property,
}: {
  tokens: TokenEntry[];
  property: "width" | "radius";
}): React.JSX.Element {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {tokens.map((token) => (
        <li className={styles.sizeToken} key={token.name}>
          <code className={styles.tokenName} style={{ minInlineSize: "11rem" }}>
            {token.name}
          </code>
          <span className={styles.tokenValue} style={{ minInlineSize: "4rem" }}>
            {token.value}
          </span>
          <span
            className={styles.sizeBar}
            aria-hidden="true"
            style={
              property === "width"
                ? { inlineSize: `var(${token.name})`, minInlineSize: "2px" }
                : {
                    inlineSize: "3.5rem",
                    blockSize: "2.25rem",
                    borderRadius: `var(${token.name})`,
                  }
            }
          />
        </li>
      ))}
    </ul>
  );
}
