import { JWTModule } from "@modules/jwt/jwt.module";
import { MapPlaceRepository } from "@modules/map/domain/mapPlace.repository";
import { MapGooglePlacesRepository } from "@modules/map/infrastructure/mapGooglePlaces.repository";
import { MapController } from "@modules/map/presentation/map.controller";
import { MapService } from "@modules/map/services/map.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [JWTModule],
  controllers: [MapController],
  providers: [
    MapService,
    {
      provide: MapPlaceRepository,
      useClass: MapGooglePlacesRepository
    }
  ],
  exports: [MapService]
})
export class MapModule {}
