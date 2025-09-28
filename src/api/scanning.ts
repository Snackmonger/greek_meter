import { GreekEncoding } from "../common/enums";

interface ScansionReport {}

function scan(text: string): ScansionReport {
  return {};
}

function convert(text: string, outputFormat: Omit<GreekEncoding, GreekEncoding.UNKNOWN>): string {
  return "";
}

function scanDactylicHexameter(text: string): ScansionReport {
  return {};
}

function scanIambicTrimeter(text: string): ScansionReport {
  return {};
}

function scanElegiacs(text: string): ScansionReport {
  return {};
}
