require("dotenv").config();
import yargs from "yargs";
import { FakturowniaClient } from "./shared/clients/fakturownia.client";
import { FileService } from "./shared/services/file.service";

enum Action {
  GET = "get",
  GET_ALL = "get-all",
  CREATE = "create",
  EDIT = "edit",
  DELETE = "delete",
}

const options = Object.values(Action);

const parser = yargs(process.argv.slice(2))
  .describe("action", "Select an action to exectue")
  .describe("id", "Invoice id")
  .choices("action", options)
  .demandOption("action")
  .help();

(async () => {
  try {
    const fakturowniaClient = new FakturowniaClient();
    const fileService = new FileService();

    const argv = await parser.argv;
    const action: Action = argv.action as any;
    const id: string = argv.id as any;

    switch (action) {
      case Action.GET:
        if (!id) {
          throw new Error("Id is required");
        }

        const invoice = await fakturowniaClient.get(id);
        await fileService.save("invoice", invoice);
        break;
      case Action.GET_ALL:
        const allInvoices = await fakturowniaClient.list();
        await fileService.save("invoice-all", allInvoices);
        break;
      case Action.CREATE:
        const newInvoice = await fileService.get("new");
        await fakturowniaClient.add(newInvoice);
        break;
      case Action.EDIT:
        if (!id) {
          throw new Error("Id is required");
        }

        const updateInvoice = await fileService.get("update");
        await fakturowniaClient.update(id, updateInvoice);
        break;
      case Action.DELETE:
        if (!id) {
          throw new Error("Id is required");
        }

        await fakturowniaClient.delete(id);
        break;
      default:
        throw new Error("Unknown action type");
    }
  } catch (e) {
    console.log(e);
  }
})();
