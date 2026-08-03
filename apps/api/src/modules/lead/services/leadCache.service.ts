import { SEARCH_TTL_SECONDS } from "@modules/lead/domain/lead.value-objects";
import { Injectable } from "@nestjs/common";
import { RedisService } from "@redis/services/redis.service";
import { GetLeadsDto, GetLeadsResponseDto } from "@repo/dtos/lead";

@Injectable()
export class LeadCacheService {
  constructor(private readonly redisService: RedisService) {}

  private searchKey(companyId: string, dto: GetLeadsDto): string {
    const statusKey = dto.status ? dto.status.join(",") : "all";
    return `leads:search:${companyId}:page=${dto.page}:limit=${dto.limit}:status=${statusKey}`;
  }

  getSearch(companyId: string, dto: GetLeadsDto): Promise<GetLeadsResponseDto | null> {
    return this.redisService.get<GetLeadsResponseDto>(this.searchKey(companyId, dto));
  }

  setSearch(companyId: string, dto: GetLeadsDto, response: GetLeadsResponseDto): Promise<"OK"> {
    return this.redisService.set(this.searchKey(companyId, dto), response, SEARCH_TTL_SECONDS);
  }

  invalidate(companyId: string): Promise<void> {
    return this.redisService.deleteByPattern(`leads:search:${companyId}:*`);
  }
}
