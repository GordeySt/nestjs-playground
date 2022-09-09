import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { API_URLS } from "./hh.constants";
import { HhResponse } from "./hh.models";
import { lastValueFrom } from "rxjs";
import { HhData } from "../top-page/top-page.model";

@Injectable()
export class HhService {
  constructor(private readonly httpService: HttpService) {
  }

  async getData() {
    try {
      const { data } = await lastValueFrom(this.httpService.get<HhResponse>(API_URLS.employers));

      return this.parseData(data);
    } catch (e) {
      Logger.error(e);
    }
  }

  private parseData(data: HhResponse): HhData {
    return {
      companyName: data.items[1].name,
      openVacanciesCount: data.items[1].open_vacancies + 1,
      updatedAt: new Date()
    }
  }
}
