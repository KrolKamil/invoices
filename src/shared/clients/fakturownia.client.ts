import axios, { AxiosInstance } from "axios";

export class FakturowniaClient {
  private instance: AxiosInstance;
  private apiToken: string;

  constructor() {
    this.instance = axios.create({
      baseURL: "https://kamil-krol-test.fakturownia.pl/",
    });

    this.apiToken = process.env.FAKTUROWNIA_TOKEN as string;
  }

  async get(id: string) {
    const response = await this.instance.get(
      `invoices/${id}.json?api_token=${this.apiToken}`
    );

    return response.data;
  }

  async list() {
    const response = await this.instance.get(
      `invoices.json?period=this_month&page=1&per_page=25&api_token=${this.apiToken}`
    );

    return response.data;
  }

  async add(invoice: any) {
    await this.instance.post("invoices.json", {
      api_token: this.apiToken,
      invoice,
    });
  }

  async delete(id: string) {
    await this.instance.delete(
      `invoices/${id}.json?api_token=${this.apiToken}`
    );
  }

  async update(id: string, invoice: any) {
    await this.instance.put(`invoices/${id}.json`, {
      api_token: this.apiToken,
      invoice,
    });
  }
}
