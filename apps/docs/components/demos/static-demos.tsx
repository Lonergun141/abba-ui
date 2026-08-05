import {
  Alert,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Code,
  Container,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  FormField,
  FormMessage,
  Grid,
  Heading,
  IconButton,
  Inline,
  Input,
  Label,
  Link,
  Separator,
  Spinner,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTrigger,
  Text,
  Textarea,
  VisuallyHidden,
} from "@abbainitiative/ui";
import type * as React from "react";

/**
 * Live demos that need no local state.
 *
 * This module has no "use client" directive. Everything here renders on the
 * server, including the demos that contain Button and Input — those components
 * carry their own client boundaries, so the surrounding demo does not need one.
 * That is the whole point of the library's per-component directive placement.
 *
 * Dialog, DropdownMenu and Tabs appear here too. They are stateful, but they are
 * used declaratively: no function crosses the server/client boundary, so the
 * demo itself has nothing to serialise. Only the two demos that need a handler
 * or a hook live in ./interactive-demos.
 */

const PlusIcon = (): React.JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const staticDemos: Record<string, React.ReactNode> = {
  /* ------------------------------------------------------------- layout */
  "box-basic": (
    <Box padding={5} background="subtle" radius="lg" bordered>
      <Text>Content on a subtle surface</Text>
    </Box>
  ),

  "stack-basic": (
    <Stack gap={3}>
      <Text>First</Text>
      <Text>Second</Text>
      <Text>Third</Text>
    </Stack>
  ),

  "inline-basic": (
    <Inline gap={2}>
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
    </Inline>
  ),

  "container-basic": (
    <Container size="sm" padded={false}>
      <Text>
        Long-form text stays readable at a comfortable measure, rather than running the
        full width of a wide display.
      </Text>
    </Container>
  ),

  "grid-responsive": (
    <Grid minItemWidth="10rem" gap={4} style={{ inlineSize: "100%" }}>
      <Card>
        <CardBody>One</CardBody>
      </Card>
      <Card>
        <CardBody>Two</CardBody>
      </Card>
      <Card>
        <CardBody>Three</CardBody>
      </Card>
    </Grid>
  ),

  "separator-basic": (
    <Stack gap={4} fullWidth>
      <Text>Above the rule</Text>
      <Separator />
      <Text>Below the rule</Text>
    </Stack>
  ),

  "visually-hidden-basic": (
    <Stack gap={2}>
      <VisuallyHidden as="div">Section heading for screen readers</VisuallyHidden>
      <Text tone="muted" size="sm">
        There is a hidden heading directly above this line. Inspect the DOM, or listen
        with a screen reader, to find it.
      </Text>
    </Stack>
  ),

  /* --------------------------------------------------------- typography */
  "text-tones": (
    <Stack gap={2}>
      <Text size="lg">Large body copy</Text>
      <Text>Default body copy</Text>
      <Text tone="muted">Muted supporting text</Text>
      <Text tone="danger" weight="medium">
        Something went wrong
      </Text>
    </Stack>
  ),

  "heading-levels": (
    <Stack gap={3}>
      <Heading level={1}>Page title</Heading>
      <Heading level={2}>Section</Heading>
      <Heading level={3} size="display">
        Visually large, still an h3
      </Heading>
    </Stack>
  ),

  "label-basic": (
    <Stack gap={2}>
      <Label htmlFor="demo-email" required>
        Email address
      </Label>
      <Input id="demo-email" type="email" placeholder="you@example.com" />
    </Stack>
  ),

  "code-basic": (
    <Stack gap={3} fullWidth>
      <Text>
        Run <Code>pnpm install</Code> to begin.
      </Text>
      <Code variant="block">{'const theme = "dark";'}</Code>
    </Stack>
  ),

  "link-basic": (
    <Inline gap={4}>
      <Link href="/docs">Documentation</Link>
      <Link href="https://example.com" external>
        External site
      </Link>
      <Link href="/docs" underline="always">
        Always underlined
      </Link>
    </Inline>
  ),

  /* ------------------------------------------------------------ actions */
  "button-variants": (
    <Inline gap={2}>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </Inline>
  ),

  "button-sizes": (
    <Inline gap={2}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Inline>
  ),

  "button-states": (
    <Inline gap={2}>
      <Button loading>Saving</Button>
      <Button disabled>Disabled</Button>
      <Button leftIcon={<PlusIcon />}>With icon</Button>
      <Button asChild>
        <a href="#button">As a link</a>
      </Button>
    </Inline>
  ),

  "icon-button-basic": (
    <Inline gap={2}>
      <IconButton aria-label="Add item" icon={<PlusIcon />} />
      <IconButton aria-label="Add item" variant="outline" icon={<PlusIcon />} />
      <IconButton aria-label="Add item" variant="ghost" round icon={<PlusIcon />} />
      <IconButton aria-label="Delete item" variant="danger" icon={<PlusIcon />} />
    </Inline>
  ),

  "button-group-basic": (
    <Stack gap={4}>
      <ButtonGroup aria-label="Text alignment">
        <Button variant="outline">Left</Button>
        <Button variant="outline">Centre</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Record actions" attached={false}>
        <Button>Save</Button>
        <Button variant="ghost">Cancel</Button>
      </ButtonGroup>
    </Stack>
  ),

  /* -------------------------------------------------------------- forms */
  "input-basic": (
    <Stack gap={3} fullWidth>
      <Input aria-label="Small field" size="sm" placeholder="Small" />
      <Input aria-label="Medium field" placeholder="Medium" />
      <Input aria-label="Large field" size="lg" placeholder="Large" />
      <Input aria-label="Amount" prefix="₱" suffix=".00" placeholder="0" />
    </Stack>
  ),

  "input-invalid": (
    <Input aria-label="Email address" invalid defaultValue="not-an-email" />
  ),

  "textarea-basic": (
    <Stack gap={3} fullWidth>
      <Textarea aria-label="Notes" placeholder="Write a note…" />
      <Textarea
        aria-label="Auto-sizing notes"
        autoSize
        placeholder="This one grows as you type"
      />
    </Stack>
  ),

  "form-field-basic": (
    <Stack gap={5} fullWidth>
      <FormField
        label="Email address"
        description="We only use this to sign you in."
        required
      >
        <Input type="email" placeholder="you@example.com" />
      </FormField>

      <FormField label="Username" error="That username is already taken.">
        <Input defaultValue="ada" />
      </FormField>
    </Stack>
  ),

  "form-message-basic": (
    <Stack gap={2}>
      <FormMessage>Use your work address.</FormMessage>
      <FormMessage tone="error">This field is required.</FormMessage>
      <FormMessage tone="success">Looks good.</FormMessage>
    </Stack>
  ),

  /* ------------------------------------------------------- data display */
  "card-variants": (
    <Grid minItemWidth="11rem" gap={4} style={{ inlineSize: "100%" }}>
      <Card variant="outlined">
        <CardBody>Outlined</CardBody>
      </Card>
      <Card variant="elevated">
        <CardBody>Elevated</CardBody>
      </Card>
      <Card variant="filled">
        <CardBody>Filled</CardBody>
      </Card>
    </Grid>
  ),

  "card-composed": (
    <Card variant="elevated" style={{ maxInlineSize: "22rem" }}>
      <CardHeader>
        <Heading level={3} size="md">
          Monthly report
        </Heading>
        <Text size="sm" tone="muted">
          Generated 4 August
        </Text>
      </CardHeader>
      <CardBody>
        <Text size="sm">Contributions rose 12% against the previous period.</Text>
      </CardBody>
      <CardFooter divided>
        <Button size="sm">Download</Button>
        <Button size="sm" variant="ghost">
          Share
        </Button>
      </CardFooter>
    </Card>
  ),

  "badge-tones": (
    <Inline gap={2}>
      <Badge>Neutral</Badge>
      <Badge tone="primary">Primary</Badge>
      <Badge tone="accent">Accent</Badge>
      <Badge tone="success" dot>
        Active
      </Badge>
      <Badge tone="warning">Pending</Badge>
      <Badge tone="danger" srLabel="Status:">
        Overdue
      </Badge>
      <Badge tone="info">Info</Badge>
    </Inline>
  ),

  "badge-variants": (
    <Stack gap={3}>
      <Inline gap={2}>
        <Badge tone="primary" variant="subtle">
          Subtle
        </Badge>
        <Badge tone="primary" variant="solid">
          Solid
        </Badge>
        <Badge tone="primary" variant="outline">
          Outline
        </Badge>
      </Inline>
      <Inline gap={2}>
        <Badge size="sm">Small</Badge>
        <Badge size="md">Medium</Badge>
        <Badge size="lg">Large</Badge>
      </Inline>
    </Stack>
  ),

  /* ----------------------------------------------------------- feedback */
  "alert-tones": (
    <Stack gap={3} fullWidth>
      <Alert tone="info" title="Scheduled maintenance">
        The service will be unavailable on Sunday from 02:00.
      </Alert>
      <Alert tone="success" title="Saved">
        Your changes are live.
      </Alert>
      <Alert tone="warning" title="Approaching your limit">
        You have used 92% of your quota.
      </Alert>
      <Alert tone="danger" title="Payment failed">
        Update your card details to continue.
      </Alert>
    </Stack>
  ),

  "spinner-sizes": (
    <Inline gap={4}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </Inline>
  ),

  /* ----------------------------------------------------------- overlays */
  "dialog-basic": (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="danger">Delete project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this project?</DialogTitle>
          <DialogDescription>
            This permanently removes the project and all of its data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="danger">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),

  "dropdown-basic": (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Manage</DropdownMenuLabel>
        <DropdownMenuItem>
          Edit<DropdownMenuShortcut>Ctrl E</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem disabled>Archive</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem tone="danger">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),

  "tabs-basic": (
    <Stack gap={6} fullWidth>
      <Tabs defaultValue="overview">
        <TabsList aria-label="Project sections">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsPanel value="overview">
          <Text size="sm">The line variant, which is the default.</Text>
        </TabsPanel>
        <TabsPanel value="activity">
          <Text size="sm">Activity content.</Text>
        </TabsPanel>
        <TabsPanel value="settings">
          <Text size="sm">Settings content.</Text>
        </TabsPanel>
      </Tabs>

      <Tabs defaultValue="overview" variant="enclosed">
        <TabsList aria-label="Project sections, enclosed">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsPanel value="overview">
          <Text size="sm">The enclosed variant.</Text>
        </TabsPanel>
        <TabsPanel value="activity">
          <Text size="sm">Activity content.</Text>
        </TabsPanel>
      </Tabs>
    </Stack>
  ),
};
