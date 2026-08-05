"use client";

import { Button } from "@abbainitiative/ui";
import * as React from "react";

import { PACKAGE_NAME } from "@/content/site";
import { CodeBlock } from "./code-block";
import styles from "./docs.module.css";

const MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
type Manager = (typeof MANAGERS)[number];

const COMMANDS: Record<Manager, string> = {
  pnpm: `pnpm add ${PACKAGE_NAME}`,
  npm: `npm install ${PACKAGE_NAME}`,
  yarn: `yarn add ${PACKAGE_NAME}`,
  bun: `bun add ${PACKAGE_NAME}`,
};

/**
 * The install command, switchable by package manager.
 *
 * Client-side because it holds the selected manager. Uses real buttons in a
 * labelled group rather than a custom tab widget — there are four options and
 * no panels to manage.
 */
export function InstallationCommand({
  packageName,
}: {
  packageName?: string;
}): React.JSX.Element {
  const [manager, setManager] = React.useState<Manager>("pnpm");

  const command = packageName
    ? COMMANDS[manager].replace(PACKAGE_NAME, packageName)
    : COMMANDS[manager];

  return (
    <div className={styles.install}>
      <div className={styles.installTabs} role="group" aria-label="Package manager">
        {MANAGERS.map((item) => (
          <Button
            key={item}
            size="sm"
            variant={manager === item ? "secondary" : "ghost"}
            aria-pressed={manager === item}
            onClick={() => {
              setManager(item);
            }}
          >
            {item}
          </Button>
        ))}
      </div>
      <CodeBlock code={command} language="bash" />
    </div>
  );
}
