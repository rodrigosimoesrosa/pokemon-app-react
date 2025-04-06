import axios from 'axios'

export class ApiDataSource {
  API_URL = 'https://pokeapi.co/api/v2/pokemon'
  private client = axios.create({ baseURL: this.API_URL })

  async post<T>(url: string, data: any): Promise<T> {
    const response = await this.client.post<T>(url, data)
    return response.data
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<T>(url)
    return response.data
  }
}
