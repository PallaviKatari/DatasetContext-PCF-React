# PCF Dataset Context Demo

A Power Apps Component Framework (PCF) standard control that demonstrates how a dataset control receives and renders records, responds to user selection, and tracks allocated dimensions.

## What it demonstrates

- Reads records from the `sampleDataSet` dataset configured by the host.
- Displays the dataset loading state, record count, and allocated control size.
- Renders each account as a selectable button, showing its account name, city, and record ID.
- Keeps the selected record ID and selection count as internal control state.
- Logs dataset, lifecycle, and selection information to the browser console.

This demo does not define output properties, persist the selection, or call an external service.

## Dataset configuration

The control expects the configured dataset view to include columns with these logical names:

| Logical name | Displayed as |
| --- | --- |
| `Account Name` | Account name |
| `City` | City |

If either value is empty, the control displays a placeholder. The sample account data is provided in [Accounts.csv](./Accounts.csv) and [Accounts.xlsx](./Accounts.xlsx); configure the host dataset to use the appropriate table and columns.

## Project files

- [index.ts](./index.ts) — PCF control implementation and dataset rendering.
- [ControlManifest.Input.xml](./ControlManifest.Input.xml) — declares the `sampleDataSet` dataset input.
- [css/DatasetContextDemo.css](./css/DatasetContextDemo.css) — styles for the demo UI.
- [generated/ManifestTypes.d.ts](./generated/ManifestTypes.d.ts) — generated TypeScript definitions for the manifest.

## Build and use

This folder contains the control source and manifest. To build and use it, place it in a PCF project/solution with the Power Platform CLI and the project's required build configuration, then build and import that solution into an environment. Add the control to a dataset-capable host, configure the dataset with the required columns, and open the browser developer console to inspect its diagnostic logs.

The stylesheet is present in the repository but is not currently listed as a resource in the manifest. To apply it in the packaged control, enable the CSS resource entry in `ControlManifest.Input.xml`.
