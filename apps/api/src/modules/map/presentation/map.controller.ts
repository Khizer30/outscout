import { AuthGuard } from "@middleware/auth.guard";
import { MapService } from "@modules/map/services/map.service";
import { Body, Controller, Get, HttpCode, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";
import { IdDto } from "@repo/dtos/common";
import { AutocompleteDto, AutocompleteResponseDto, GetPlaceDetailsResponseDto } from "@repo/dtos/map";

@Controller("map")
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Post("autocomplete")
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async autocomplete(@Body() dto: AutocompleteDto): Promise<AutocompleteResponseDto> {
    const results = await this.mapService.autocomplete({
      query: dto.query,
      latitude: dto.latitude,
      longitude: dto.longitude,
      radiusMeters: dto.radius,
      types: dto.types
    });

    return { data: results };
  }

  @Get("place/:id")
  @UseGuards(AuthGuard)
  async getPlaceDetails(@Param() { id }: IdDto): Promise<GetPlaceDetailsResponseDto> {
    const details = await this.mapService.getPlaceDetails(id);
    if (!details) {
      throw new NotFoundException(`Place not found: ${id}`);
    }

    return { data: details };
  }
}
