import {
  IInputs,
  IOutputs
} from "./generated/ManifestTypes";

export class DatasetContextDemo
  implements ComponentFramework.StandardControl<IInputs, IOutputs> {

  private container!: HTMLDivElement;
  private statusElement!: HTMLParagraphElement;
  private recordsContainer!: HTMLDivElement;
  private selectionElement!: HTMLParagraphElement;
  private dimensionsElement!: HTMLParagraphElement;

  // Internal state owned by this control.
  private selectedRecordId = "";
  private selectionCount = 0;

  // State dictionary supplied by the framework.
  private initialState: ComponentFramework.Dictionary = {};

  // One stable event handler for all record buttons.
  private handleContainerClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const button = target.closest<HTMLButtonElement>(
      "button[data-record-id]"
    );

    if (!button || !this.container.contains(button)) {
      return;
    }

    const recordId = button.dataset.recordId;

    if (!recordId) {
      return;
    }

    this.selectedRecordId = recordId;
    this.selectionCount++;

    console.log(
      "[Dataset] Selected record ID:",
      this.selectedRecordId
    );

    console.log(
      "[Dataset] Internal selection count:",
      this.selectionCount
    );

    this.renderSelection();
  };

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {

    console.log("========== DATASET INIT START ==========");

    this.container = container;
    this.initialState = state ?? {};

    // Ask the host to supply dimensions and notify us about resizing.
    context.mode.trackContainerResize(true);

    console.log("[init] State supplied:", state);
    console.log(
      "[init] State keys:",
      Object.keys(this.initialState)
    );

    console.log(
      "[init] Allocated width:",
      context.mode.allocatedWidth
    );

    console.log(
      "[init] Allocated height:",
      context.mode.allocatedHeight
    );

    // Create the UI once.
    const card = document.createElement("div");
    card.className = "dataset-demo";

    const heading = document.createElement("h3");
    heading.textContent = "PCF Dataset Context Demo";

    this.statusElement = document.createElement("p");
    this.statusElement.className = "status";

    this.dimensionsElement = document.createElement("p");

    this.recordsContainer = document.createElement("div");

    this.selectionElement = document.createElement("p");

    card.appendChild(heading);
    card.appendChild(this.statusElement);
    card.appendChild(this.dimensionsElement);

    const recordsHeading = document.createElement("h4");
    recordsHeading.textContent = "Account records";

    card.appendChild(recordsHeading);
    card.appendChild(this.recordsContainer);
    card.appendChild(this.selectionElement);

    this.container.appendChild(card);

    // Event delegation: clicks on any record button reach this handler.
    this.container.addEventListener(
      "click",
      this.handleContainerClick
    );

    console.log("[init] HTML elements created.");
    console.log("========== DATASET INIT END ==========");
  }

  public updateView(
    context: ComponentFramework.Context<IInputs>
  ): void {

    console.log("========== DATASET UPDATE VIEW ==========");

    const dataset = context.parameters.sampleDataSet;

    console.log("[updateView] Dataset object:", dataset);
    console.log("[updateView] Loading:", dataset.loading);
    console.log(
      "[updateView] Updated properties:",
      context.updatedProperties
    );

    console.log(
      "[updateView] Allocated width:",
      context.mode.allocatedWidth
    );

    console.log(
      "[updateView] Allocated height:",
      context.mode.allocatedHeight
    );

    console.log(
      "[updateView] Sorted record IDs:",
      dataset.sortedRecordIds
    );

    console.log(
      "[updateView] Available columns:",
      dataset.columns.map(column => ({
        name: column.name,
        displayName: column.displayName
      }))
    );

    this.dimensionsElement.textContent =
      `Allocated size: ${context.mode.allocatedWidth} x ` +
      `${context.mode.allocatedHeight}`;

    if (dataset.loading) {
      this.statusElement.textContent = "Loading records...";
      this.recordsContainer.replaceChildren();
      this.renderSelection();

      console.log("[updateView] Dataset is still loading.");
      return;
    }

    const recordIds = dataset.sortedRecordIds;

    this.statusElement.textContent =
      `Dataset loaded. Records received: ${recordIds.length}`;

    this.recordsContainer.replaceChildren();

    if (recordIds.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "No records found.";
      this.recordsContainer.appendChild(emptyMessage);
    }

    for (const id of recordIds) {
      const record = dataset.records[id];

      if (!record) {
        continue;
      }

      // These logical column names must exist in the configured view.
      const accountName =
        record.getFormattedValue("Account Name") || "(No account name)";

      const city =
        record.getFormattedValue("City") || "(No city)";

      console.log("[updateView] Record ID:", id);
      console.log("[updateView] Account name:", accountName);
      console.log("[updateView] City:", city);

      const button = document.createElement("button");
      button.type = "button";
      button.className = "record-row";
      button.dataset.recordId = id;

      if (id === this.selectedRecordId) {
        button.classList.add("selected");
      }

      const nameElement = document.createElement("strong");
      nameElement.textContent = accountName;

      const cityElement = document.createElement("div");
      cityElement.textContent = `City: ${city}`;

      const idElement = document.createElement("div");
      idElement.className = "record-id";
      idElement.textContent = `Record ID: ${id}`;

      button.appendChild(nameElement);
      button.appendChild(cityElement);
      button.appendChild(idElement);

      this.recordsContainer.appendChild(button);
    }

    this.renderSelection();

    console.log(
      "[updateView] UI refreshed. Selected ID:",
      this.selectedRecordId
    );

    console.log(
      "[updateView] Internal selection count:",
      this.selectionCount
    );

    console.log("========== DATASET UPDATE VIEW END ==========");
  }

  private renderSelection(): void {
    this.selectionElement.textContent = this.selectedRecordId
      ? `Selected record: ${this.selectedRecordId} | ` +
        `Selection count: ${this.selectionCount}`
      : `No record selected | Selection count: ${this.selectionCount}`;

    const buttons =
      this.recordsContainer.querySelectorAll<HTMLButtonElement>(
        "button[data-record-id]"
      );

    buttons.forEach(button => {
      button.classList.toggle(
        "selected",
        button.dataset.recordId === this.selectedRecordId
      );
    });
  }

  public getOutputs(): IOutputs {
    // This demo has no declared output properties.
    return {};
  }

  public destroy(): void {
    console.log("========== DATASET DESTROY ==========");

    this.container?.removeEventListener(
      "click",
      this.handleContainerClick
    );

    console.log("[destroy] Container click handler removed.");
  }
}
