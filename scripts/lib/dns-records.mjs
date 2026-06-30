/** Normalize Railway domain CLI JSON into registrar-friendly records. */

function verificationTxtValue(token) {
  let value = token;
  while (value.startsWith("railway-verify=")) {
    value = value.slice("railway-verify=".length);
  }
  return `railway-verify=${value}`;
}

function pushRecord(records, { type, host, value, purpose }) {
  if (!type || !host || !value) return;
  const key = `${type}|${host}|${value}`;
  if (records.some((r) => `${r.type}|${r.host}|${r.value}` === key)) return;
  records.push({ type, host, value, purpose });
}

function fromDnsRecordOutput(record) {
  const type = record.recordType ?? record.record_type ?? record.type;
  const host = record.name ?? record.host ?? "@";
  const value = record.requiredValue ?? record.required_value ?? record.value;
  const purpose = record.purpose ?? "";
  return { type, host, value, purpose };
}

function extractFromDomainDetails(domain) {
  const records = [];
  const domainName = domain.domain ?? domain.summary?.domain ?? "";

  for (const raw of domain.dnsRecords ?? domain.dns_records ?? []) {
    const { type, host, value, purpose } = fromDnsRecordOutput(raw);
    pushRecord(records, { type, host, value, purpose });
  }

  const verification = domain.verification ?? {};
  const token = verification.token ?? domain.verificationToken;
  const dnsHost = verification.dnsHost ?? verification.dns_host ?? domain.verificationDnsHost;
  if (token && dnsHost) {
    pushRecord(records, {
      type: "TXT",
      host: dnsHost,
      value: verificationTxtValue(token),
      purpose: "ownership verification",
    });
  }

  return { domain: domainName, records };
}

/** @param {unknown} payload Railway `domain`, `domain status`, or legacy create JSON */
export function parseRailwayDomainJson(payload) {
  if (!payload || typeof payload !== "object") {
    return { domain: "", records: [] };
  }

  if (payload.domain) {
    return extractFromDomainDetails(payload.domain);
  }

  const created =
    payload.customDomainCreate ??
    payload.custom_domain_create ??
    payload.custom_domain_create?.status;

  if (created) {
    const status = created.status ?? created;
    const domainName = created.domain ?? status.domain ?? "";
    const records = [];

    for (const raw of status.dnsRecords ?? status.dns_records ?? []) {
      const { type, host, value, purpose } = fromDnsRecordOutput(raw);
      pushRecord(records, { type, host, value, purpose });
    }

    const token = status.verificationToken ?? status.verification_token;
    const dnsHost = status.verificationDnsHost ?? status.verification_dns_host;
    if (token && dnsHost) {
      pushRecord(records, {
        type: "TXT",
        host: dnsHost,
        value: verificationTxtValue(token),
        purpose: "ownership verification",
      });
    }

    return { domain: domainName, records };
  }

  if (Array.isArray(payload.dnsRecords) || Array.isArray(payload.dns_records)) {
    return extractFromDomainDetails(payload);
  }

  return { domain: "", records: [] };
}

export function formatDnsTable(records) {
  if (!records.length) {
    return "(no DNS records returned — check Railway dashboard Networking tab)";
  }

  const lines = ["| Type | Name / Host | Value |", "|------|-------------|-------|"];
  for (const { type, host, value } of records) {
    lines.push(`| ${type} | \`${host}\` | \`${value}\` |`);
  }
  return lines.join("\n");
}

export function formatDnsInstructions(domains) {
  const sections = [];

  for (const { domain, records } of domains) {
    if (!domain) continue;
    sections.push(`### ${domain}\n\n${formatDnsTable(records)}`);
  }

  if (!sections.length) {
    return [
      "No DNS records were returned by Railway.",
      "Run `railway login`, link this project, then:",
      "  railway domain donrockbrune.com --json",
      "  railway domain www.donrockbrune.com --json",
    ].join("\n");
  }

  return sections.join("\n\n");
}
