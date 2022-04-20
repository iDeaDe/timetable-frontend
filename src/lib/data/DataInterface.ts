import { AxiosRequestConfig } from "axios";

interface DataInterface {
  name: string
  address: string
  data: unknown

  isLoaded?: boolean
  requestType?: string
  requestOptions?: AxiosRequestConfig
}

export { DataInterface };
