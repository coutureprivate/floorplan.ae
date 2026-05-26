import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
  Rect,
} from "@react-pdf/renderer";
import type { UnitInstance, UnitType, Project } from "../types";
import { PDF_COLORS, formatAed, formatUsd } from "./theme";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    backgroundColor: PDF_COLORS.canvas,
    color: PDF_COLORS.ink,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  wordmark: {
    fontSize: 16,
    fontFamily: "Times-Roman",
    letterSpacing: 2,
    color: PDF_COLORS.deep,
  },
  wordmarkSub: {
    fontSize: 7,
    letterSpacing: 1.5,
    color: PDF_COLORS.copper,
    marginTop: 2,
    textTransform: "uppercase",
  },
  eyebrow: {
    fontSize: 7,
    letterSpacing: 1.5,
    color: PDF_COLORS.copper,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontFamily: "Times-Roman",
    color: PDF_COLORS.deep,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 10,
    color: PDF_COLORS.muted,
    marginTop: 4,
  },
  rule: {
    height: 0.5,
    backgroundColor: PDF_COLORS.deep,
    opacity: 0.15,
    marginVertical: 16,
  },
  twoCol: {
    flexDirection: "row",
    gap: 24,
    marginTop: 16,
  },
  planBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderColor: PDF_COLORS.deep,
    borderWidth: 0.5,
    padding: 12,
  },
  facts: {
    width: 200,
  },
  factRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: PDF_COLORS.deep,
    borderBottomStyle: "solid",
  },
  factLabel: {
    color: PDF_COLORS.muted,
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  factValue: {
    fontFamily: "Times-Roman",
    color: PDF_COLORS.deep,
    fontSize: 11,
  },
  bigPrice: {
    fontFamily: "Times-Roman",
    fontSize: 22,
    color: PDF_COLORS.copper,
    marginTop: 8,
  },
  altPrice: {
    fontSize: 9,
    color: PDF_COLORS.muted,
    marginTop: 2,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    color: PDF_COLORS.muted,
    fontSize: 7,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontFamily: "Times-Roman",
    fontSize: 14,
    color: PDF_COLORS.deep,
    marginTop: 24,
    marginBottom: 8,
  },
  roomList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  roomChip: {
    width: "31%",
    padding: 8,
    borderWidth: 0.5,
    borderColor: PDF_COLORS.deep,
    borderStyle: "solid",
  },
  roomLabel: { fontSize: 8, color: PDF_COLORS.muted, textTransform: "uppercase", letterSpacing: 1 },
  roomValue: { fontFamily: "Times-Roman", color: PDF_COLORS.deep, fontSize: 11, marginTop: 2 },
});

export function UnitSummaryPDF({
  instance,
  unitType,
  project,
}: {
  instance: UnitInstance;
  unitType: UnitType;
  project: Project;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header / wordmark */}
        <View style={styles.header}>
          <View>
            <Text style={styles.wordmark}>COUTURE</Text>
            <Text style={styles.wordmarkSub}>Private Estates</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.eyebrow}>Unit Summary</Text>
            <Text style={{ fontSize: 9, color: PDF_COLORS.muted, marginTop: 4 }}>
              {project.developer} · {project.area}
            </Text>
          </View>
        </View>

        {/* Title block */}
        <Text style={styles.eyebrow}>{project.name}</Text>
        <Text style={styles.title}>Unit {instance.unit_number}</Text>
        <Text style={styles.subtitle}>
          {unitType.type_designation} · {unitType.bedrooms} BR · {unitType.total_sqft.toLocaleString()} sqft · {instance.view_orientation} view
        </Text>

        <View style={styles.rule} />

        {/* Two columns: plan + facts */}
        <View style={styles.twoCol}>
          <View style={styles.planBox}>
            <Text style={styles.eyebrow}>Unit Plan</Text>
            <PlanSvg unitType={unitType} />
          </View>
          <View style={styles.facts}>
            <Text style={styles.eyebrow}>Asking</Text>
            <Text style={styles.bigPrice}>{formatAed(instance.current_asking_price_aed)}</Text>
            <Text style={styles.altPrice}>~ {formatUsd(instance.current_asking_price_aed)}</Text>

            <View style={{ height: 16 }} />

            <Fact label="Status" value={instance.current_status.toUpperCase()} />
            <Fact label="Floor" value={String(instance.floor_number)} />
            <Fact label="Position" value={instance.position_number} />
            <Fact label="Bedrooms" value={String(unitType.bedrooms)} />
            <Fact label="Bathrooms" value={String(unitType.bathrooms)} />
            <Fact label="Total" value={`${unitType.total_sqft.toLocaleString()} sqft`} />
            <Fact label="Inner" value={`${unitType.inner_sqft.toLocaleString()} sqft`} />
            <Fact label="Balcony" value={`${unitType.balcony_sqft.toLocaleString()} sqft`} />
            <Fact label="View" value={instance.view_orientation} />
            <Fact label="Handover" value={project.handover} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Room breakdown</Text>
        <View style={styles.roomList}>
          {unitType.rooms.map((r) => (
            <View key={r.label} style={styles.roomChip}>
              <Text style={styles.roomLabel}>{r.label}</Text>
              <Text style={styles.roomValue}>{r.size_sqft.toLocaleString()} sqft</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>Couture Private Estates · Brokerage</Text>
          <Text>Generated by Floor Plan Atlas</Text>
        </View>
      </Page>
    </Document>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.factRow}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

function PlanSvg({ unitType }: { unitType: UnitType }) {
  return (
    <Svg viewBox="-4 -4 108 108" style={{ width: "100%", height: 240, marginTop: 8 }}>
      <Rect x={-4} y={-4} width={108} height={108} fill={PDF_COLORS.canvas} />
      <Path d={unitType.plan.outline} fill="#EFEEE7" stroke={PDF_COLORS.deep} strokeWidth={0.5} />
      {unitType.plan.rooms.map((r, i) => (
        <Path
          key={i}
          d={r.polygon}
          fill="#FFFFFF"
          stroke={PDF_COLORS.deep}
          strokeWidth={0.3}
        />
      ))}
    </Svg>
  );
}
