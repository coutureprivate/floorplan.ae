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

type Side = { instance: UnitInstance; unitType: UnitType; project: Project };

const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: PDF_COLORS.canvas,
    color: PDF_COLORS.ink,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  wordmark: {
    fontSize: 14,
    fontFamily: "Times-Roman",
    letterSpacing: 2,
    color: PDF_COLORS.deep,
  },
  wordmarkSub: {
    fontSize: 6,
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
  },
  title: {
    fontSize: 22,
    fontFamily: "Times-Roman",
    color: PDF_COLORS.deep,
    marginTop: 6,
  },
  rule: {
    height: 0.5,
    backgroundColor: PDF_COLORS.deep,
    opacity: 0.15,
    marginVertical: 12,
  },
  cols: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
  },
  col: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: PDF_COLORS.deep,
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  colHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  colTitle: { fontFamily: "Times-Roman", fontSize: 14, color: PDF_COLORS.deep, marginTop: 4 },
  colSub: { fontSize: 8, color: PDF_COLORS.muted, marginTop: 2 },
  price: { fontFamily: "Times-Roman", fontSize: 14, color: PDF_COLORS.copper, marginTop: 6 },
  miniRule: { height: 0.5, backgroundColor: PDF_COLORS.deep, opacity: 0.1, marginVertical: 8 },
  diffTable: { marginTop: 18, borderTopWidth: 0.5, borderTopColor: PDF_COLORS.deep, borderTopStyle: "solid" },
  diffRow: {
    flexDirection: "row",
    borderBottomWidth: 0.3,
    borderBottomColor: PDF_COLORS.deep,
    borderBottomStyle: "solid",
    paddingVertical: 5,
  },
  diffLabel: { flex: 1, color: PDF_COLORS.muted, fontSize: 8, textTransform: "uppercase", letterSpacing: 1 },
  diffVal: { flex: 1, fontFamily: "Times-Roman", color: PDF_COLORS.deep, textAlign: "right", fontSize: 10 },
  diffDelta: { flex: 0.6, color: PDF_COLORS.copper, textAlign: "right", fontSize: 9 },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    color: PDF_COLORS.muted,
    fontSize: 6,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
});

export function ComparisonPDF({ a, b }: { a: Side; b: Side }) {
  const maxSqft = Math.max(a.unitType.total_sqft, b.unitType.total_sqft);
  const scaleA = Math.sqrt(a.unitType.total_sqft / maxSqft);
  const scaleB = Math.sqrt(b.unitType.total_sqft / maxSqft);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.wordmark}>COUTURE</Text>
            <Text style={styles.wordmarkSub}>Private Estates</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.eyebrow}>Comparison Sheet</Text>
            <Text style={{ fontSize: 8, color: PDF_COLORS.muted, marginTop: 2 }}>
              True-scale plans · {new Date().toISOString().slice(0, 10)}
            </Text>
          </View>
        </View>

        <Text style={styles.eyebrow}>Side by side</Text>
        <Text style={styles.title}>
          {a.unitType.type_designation} vs. {b.unitType.type_designation}
        </Text>

        <View style={styles.rule} />

        <View style={styles.cols}>
          <SideCol side="A" data={a} scale={scaleA} />
          <SideCol side="B" data={b} scale={scaleB} />
        </View>

        <View style={styles.diffTable}>
          <DiffRow label="Project"    a={a.project.name}                          b={b.project.name} />
          <DiffRow label="Area"       a={a.project.area}                          b={b.project.area} />
          <DiffRow label="Bedrooms"   a={String(a.unitType.bedrooms)}             b={String(b.unitType.bedrooms)} delta={signed(b.unitType.bedrooms - a.unitType.bedrooms)} />
          <DiffRow label="Total sqft" a={a.unitType.total_sqft.toLocaleString()}  b={b.unitType.total_sqft.toLocaleString()} delta={signed(b.unitType.total_sqft - a.unitType.total_sqft, " sqft")} />
          <DiffRow label="Inner sqft" a={a.unitType.inner_sqft.toLocaleString()}  b={b.unitType.inner_sqft.toLocaleString()} delta={signed(b.unitType.inner_sqft - a.unitType.inner_sqft, " sqft")} />
          <DiffRow label="Balcony sqft" a={a.unitType.balcony_sqft.toLocaleString()} b={b.unitType.balcony_sqft.toLocaleString()} delta={signed(b.unitType.balcony_sqft - a.unitType.balcony_sqft, " sqft")} />
          <DiffRow label="View"       a={a.instance.view_orientation}             b={b.instance.view_orientation} />
          <DiffRow label="Floor"      a={String(a.instance.floor_number)}         b={String(b.instance.floor_number)} delta={signed(b.instance.floor_number - a.instance.floor_number)} />
          <DiffRow label="Status"     a={a.instance.current_status}               b={b.instance.current_status} />
          <DiffRow label="Asking"     a={formatAed(a.instance.current_asking_price_aed)} b={formatAed(b.instance.current_asking_price_aed)} />
          <DiffRow label="AED/sqft"   a={Math.round(a.instance.current_asking_price_aed / a.unitType.total_sqft).toLocaleString()}
                                       b={Math.round(b.instance.current_asking_price_aed / b.unitType.total_sqft).toLocaleString()}
                                       delta={signed(
                                          Math.round(b.instance.current_asking_price_aed / b.unitType.total_sqft) -
                                          Math.round(a.instance.current_asking_price_aed / a.unitType.total_sqft)
                                       )} />
        </View>

        <View style={styles.footer}>
          <Text>Couture Private Estates · Brokerage</Text>
          <Text>Generated by Floor Plan Atlas</Text>
        </View>
      </Page>
    </Document>
  );
}

function SideCol({ side, data, scale }: { side: "A" | "B"; data: Side; scale: number }) {
  return (
    <View style={styles.col}>
      <View style={styles.colHeader}>
        <Text style={styles.eyebrow}>Slot {side}</Text>
        <Text style={{ fontSize: 7, color: PDF_COLORS.muted }}>Unit {data.instance.unit_number}</Text>
      </View>
      <Text style={styles.colTitle}>{data.unitType.type_designation}</Text>
      <Text style={styles.colSub}>{data.project.name} · {data.project.area}</Text>
      <Text style={styles.price}>{formatAed(data.instance.current_asking_price_aed)}</Text>
      <Text style={{ fontSize: 8, color: PDF_COLORS.muted, marginTop: 1 }}>
        ~ {formatUsd(data.instance.current_asking_price_aed)}
      </Text>

      <View style={styles.miniRule} />

      <View style={{ alignItems: "center" }}>
        <View style={{ width: `${scale * 100}%` }}>
          <Svg viewBox="-4 -4 108 108" style={{ width: "100%", height: 200 }}>
            <Rect x={-4} y={-4} width={108} height={108} fill="#FFFFFF" />
            <Path d={data.unitType.plan.outline} fill="#EFEEE7" stroke={PDF_COLORS.deep} strokeWidth={0.5} />
            {data.unitType.plan.rooms.map((r, i) => (
              <Path key={i} d={r.polygon} fill="#F4F4F4" stroke={PDF_COLORS.deep} strokeWidth={0.3} />
            ))}
          </Svg>
        </View>
      </View>

      <Text style={{ fontSize: 7, color: PDF_COLORS.muted, textAlign: "center", marginTop: 6 }}>
        {data.unitType.total_sqft.toLocaleString()} sqft · {data.unitType.bedrooms} BR · {data.instance.view_orientation}
      </Text>
    </View>
  );
}

function DiffRow({ label, a, b, delta }: { label: string; a: string; b: string; delta?: string }) {
  return (
    <View style={styles.diffRow}>
      <Text style={styles.diffLabel}>{label}</Text>
      <Text style={styles.diffVal}>{a}</Text>
      <Text style={styles.diffVal}>{b}</Text>
      <Text style={styles.diffDelta}>{delta ?? "—"}</Text>
    </View>
  );
}

function signed(d: number, suffix = "") {
  if (d === 0) return "—";
  const sign = d > 0 ? "+" : "−";
  return `${sign}${Math.abs(d).toLocaleString()}${suffix}`;
}
