import { WebScrapingService } from "@modules/webScraping/services/webScraping.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [WebScrapingService],
  exports: [WebScrapingService]
})
export class WebScrapingModule {}
