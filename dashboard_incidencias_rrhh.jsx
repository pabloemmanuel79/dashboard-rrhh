import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, ComposedChart, Area } from "recharts";

const COLORS = {
  dark: "#1F3864",
  blue: "#2E75B6",
  blueLight: "#5B9BD5",
  bluePale: "#D5E8F0",
  green: "#548235",
  greenLight: "#A9D18E",
  red: "#C00000",
  redLight: "#FF6B6B",
  orange: "#ED7D31",
  orangeLight: "#F4B183",
  gray: "#666666",
  grayLight: "#F2F2F2",
  white: "#FFFFFF",
};

const monthlyData = [
  { mes: "Jul-25", total: 1, completadas: 1, pendientes: 0 },
  { mes: "Sep-25", total: 4, completadas: 4, pendientes: 0 },
  { mes: "Oct-25", total: 23, completadas: 23, pendientes: 0 },
  { mes: "Nov-25", total: 21, completadas: 21, pendientes: 0 },
  { mes: "Dic-25", total: 15, completadas: 15, pendientes: 0 },
  { mes: "Ene-26", total: 10, completadas: 8, pendientes: 2 },
  { mes: "Feb-26", total: 7, completadas: 6, pendientes: 1 },
];

const categoryData = [
  { name: "Liquidación de salarios", value: 37, color: COLORS.red },
  { name: "Marcación / Asistencia", value: 15, color: COLORS.orange },
  { name: "SCR / Cambio de rol", value: 5, color: COLORS.blue },
  { name: "Soporte / Usuario", value: 8, color: COLORS.green },
  { name: "Habilitaciones / Mejoras", value: 6, color: COLORS.blueLight },
  { name: "Sistema / Otros", value: 10, color: COLORS.gray },
];

const responseTimeData = [
  { categoria: "Soporte", promedio: 1, min: 0.5, max: 2 },
  { categoria: "Marcación", promedio: 3, min: 1, max: 4 },
  { categoria: "SCR/Roles", promedio: 4, min: 2, max: 5 },
  { categoria: "Liquidación ind.", promedio: 4, min: 2, max: 7 },
  { categoria: "Liquidación grupo", promedio: 7, min: 5, max: 10 },
  { categoria: "Cálculos", promedio: 5, min: 3, max: 7 },
  { categoria: "Bloqueantes", promedio: 7, min: 4, max: 10 },
  { categoria: "Recurrentes", promedio: 7, min: 5, max: 10 },
];

const recurrentData = [
  { tipo: "Entrada como salida", reportes: 6, dias: 7 },
  { tipo: "Guardia a pendiente", reportes: 4, dias: 7 },
  { tipo: "HE AGRUPADO", reportes: 3, dias: 7 },
  { tipo: "SCR sin asistencia", reportes: 5, dias: 4 },
  { tipo: "Liquidación grupo", reportes: 14, dias: 7 },
  { tipo: "Calendario/rol", reportes: 3, dias: 2 },
  { tipo: "Usuario/acceso", reportes: 3, dias: 1 },
];

const blockingData = [
  { name: "Resueltas", value: 34, color: COLORS.green },
  { name: "Pendientes", value: 3, color: COLORS.red },
];

const pendingDetail = [
  { incidencia: "INCIDENCIAS ENERO", dias: 14, casos: 11 },
  { incidencia: "SCR PARESA", dias: 29, casos: 1 },
  { incidencia: "PROCESAR ASISTENCIA", dias: 10, casos: 4 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #ddd", borderRadius: 8, padding: "10px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <p style={{ margin: 0, fontWeight: 700, color: COLORS.dark, fontSize: 13 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: "4px 0 0", fontSize: 12, color: p.color }}>
          {p.name}: <strong>{p.value}</strong>{p.unit || ""}
        </p>
      ))}
    </div>
  );
};

const KPI = ({ value, label, color, sub }) => (
  <div style={{
    background: `linear-gradient(135deg, ${color}, ${color}dd)`,
    borderRadius: 12, padding: "20px 16px", textAlign: "center",
    boxShadow: `0 4px 16px ${color}44`, flex: 1, minWidth: 140,
  }}>
    <div style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 12, color: "#ffffffcc", marginTop: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: "#ffffff99", marginTop: 2 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ children, number }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "32px 0 16px" }}>
    <div style={{
      background: COLORS.dark, color: "#fff", width: 32, height: 32, borderRadius: "50%",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0,
    }}>{number}</div>
    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.dark, letterSpacing: -0.3 }}>{children}</h2>
  </div>
);

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.06) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Dashboard() {
  const [tab, setTab] = useState("general");

  const tabs = [
    { id: "general", label: "Resumen General" },
    { id: "tiempos", label: "Tiempos de Respuesta" },
    { id: "recurrentes", label: "Recurrentes" },
    { id: "bloqueantes", label: "Bloqueantes" },
  ];

  return (
    <div style={{
      fontFamily: "'Segoe UI', -apple-system, sans-serif",
      background: "#f5f7fb", minHeight: "100vh", padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.blue} 100%)`,
        padding: "28px 32px 20px", color: "#fff",
      }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, opacity: 0.7, fontWeight: 600 }}>
          Módulo RRHH — Sistema Futura
        </div>
        <h1 style={{ margin: "6px 0 4px", fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
          Informe de Incidencias
        </h1>
        <div style={{ fontSize: 12, opacity: 0.6 }}>
          Período: Julio 2025 – Febrero 2026 · Generado: 13 de febrero de 2026
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, background: "#fff", borderBottom: `2px solid ${COLORS.bluePale}`, paddingLeft: 16, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "12px 20px", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
            color: tab === t.id ? COLORS.dark : COLORS.gray,
            background: tab === t.id ? COLORS.bluePale : "transparent",
            borderBottom: tab === t.id ? `3px solid ${COLORS.blue}` : "3px solid transparent",
            transition: "all 0.2s", whiteSpace: "nowrap",
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "20px 24px", maxWidth: 960, margin: "0 auto" }}>

        {/* ===== TAB: GENERAL ===== */}
        {tab === "general" && (
          <>
            {/* KPIs */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
              <KPI value="81" label="Total Incidencias" color={COLORS.dark} />
              <KPI value="78" label="Completadas" color={COLORS.green} sub="96.3%" />
              <KPI value="3" label="Pendientes" color={COLORS.red} sub="3.7%" />
              <KPI value="4.6" label="Días Prom. Resp." color={COLORS.blue} sub="estimado" />
            </div>

            <SectionTitle number="1">Volumen Mensual de Incidencias</SectionTitle>
            <div style={{ background: "#fff", borderRadius: 12, padding: "20px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={monthlyData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: COLORS.gray }} />
                  <YAxis tick={{ fontSize: 11, fill: COLORS.gray }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="completadas" name="Completadas" fill={COLORS.green} radius={[4,4,0,0]} />
                  <Bar dataKey="pendientes" name="Pendientes" fill={COLORS.red} radius={[4,4,0,0]} />
                  <Line dataKey="total" name="Total" stroke={COLORS.dark} strokeWidth={2} dot={{ r: 4, fill: COLORS.dark }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <SectionTitle number="2">Distribución por Categoría</SectionTitle>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", flex: "1 1 320px" }}>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" outerRadius={100} innerRadius={45}
                      dataKey="value" labelLine={false} label={renderCustomLabel} strokeWidth={2} stroke="#fff">
                      {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" }}>
                {categoryData.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 12px", background: i % 2 === 0 ? COLORS.grayLight : "#fff", borderRadius: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: COLORS.gray, flex: 1 }}>{c.name}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.dark }}>{c.value}</span>
                    <span style={{ fontSize: 11, color: COLORS.gray }}>({(c.value / 81 * 100).toFixed(0)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ===== TAB: TIEMPOS ===== */}
        {tab === "tiempos" && (
          <>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
              <KPI value="1 día" label="Soporte / App" color={COLORS.green} sub="más rápido" />
              <KPI value="3 días" label="Marcación" color={COLORS.blueLight} />
              <KPI value="7 días" label="Liquidación" color={COLORS.orange} sub="más complejo" />
              <KPI value="4.6" label="Promedio General" color={COLORS.blue} sub="días" />
            </div>

            <SectionTitle number="1">Tiempos de Respuesta por Categoría (días)</SectionTitle>
            <div style={{ background: "#fff", borderRadius: 12, padding: "20px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={responseTimeData} layout="vertical" margin={{ top: 10, right: 30, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: COLORS.gray }} domain={[0, 12]} unit=" d" />
                  <YAxis type="category" dataKey="categoria" tick={{ fontSize: 11, fill: COLORS.gray }} width={110} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="min" name="Mínimo" fill={COLORS.greenLight} radius={[4,4,4,4]} barSize={14} />
                  <Bar dataKey="promedio" name="Promedio" fill={COLORS.blue} radius={[4,4,4,4]} barSize={14} />
                  <Bar dataKey="max" name="Máximo" fill={COLORS.orangeLight} radius={[4,4,4,4]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <SectionTitle number="2">Distribución de Resoluciones por Tiempo</SectionTitle>
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { label: "Mismo día", count: 4, pct: "5%", color: COLORS.green },
                  { label: "1 día", count: 8, pct: "10%", color: COLORS.green },
                  { label: "2 días", count: 5, pct: "6%", color: COLORS.greenLight },
                  { label: "3 días", count: 12, pct: "15%", color: COLORS.blueLight },
                  { label: "4 días", count: 14, pct: "18%", color: COLORS.blue },
                  { label: "5 días", count: 4, pct: "5%", color: COLORS.blue },
                  { label: "7 días", count: 31, pct: "40%", color: COLORS.orange },
                  { label: "Pendiente", count: 3, pct: "4%", color: COLORS.red },
                ].map((b, i) => (
                  <div key={i} style={{ textAlign: "center", flex: "1 1 80px" }}>
                    <div style={{
                      height: Math.max(20, b.count * 4.5), background: b.color, borderRadius: "6px 6px 0 0",
                      minWidth: 40, margin: "0 auto", display: "flex", alignItems: "flex-end", justifyContent: "center",
                      paddingBottom: 4, transition: "height 0.3s",
                    }}>
                      <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{b.count}</span>
                    </div>
                    <div style={{ fontSize: 10, color: COLORS.gray, marginTop: 4, fontWeight: 600 }}>{b.label}</div>
                    <div style={{ fontSize: 10, color: COLORS.gray, opacity: 0.7 }}>{b.pct}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ===== TAB: RECURRENTES ===== */}
        {tab === "recurrentes" && (
          <>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
              <KPI value="38" label="Reportes Recurrentes" color={COLORS.orange} />
              <KPI value="35" label="Resueltos" color={COLORS.green} sub="92.1%" />
              <KPI value="3" label="Pendientes" color={COLORS.red} />
              <KPI value="5 días" label="Tiempo Prom." color={COLORS.blue} />
            </div>

            <SectionTitle number="1">Errores Recurrentes: Reportes y Tiempo de Resolución</SectionTitle>
            <div style={{ background: "#fff", borderRadius: 12, padding: "20px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={recurrentData} margin={{ top: 10, right: 30, bottom: 5, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="tipo" tick={{ fontSize: 10, fill: COLORS.gray }} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: COLORS.gray }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: COLORS.gray }} unit=" d" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar yAxisId="left" dataKey="reportes" name="Nº Reportes" fill={COLORS.blue} radius={[4,4,0,0]} barSize={32} />
                  <Line yAxisId="right" dataKey="dias" name="Días resolución" stroke={COLORS.red} strokeWidth={2.5} dot={{ r: 5, fill: COLORS.red }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <SectionTitle number="2">Detalle de Errores con Riesgo de Reaparición</SectionTitle>
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              {[
                { name: "Marcación entrada como salida", reports: 6, status: "Resuelto", risk: "Alto", desc: "El sistema no permite editar cuando se marca entrada como salida" },
                { name: "Guardias que revierten a pendiente", reports: 4, status: "Resuelto", risk: "Alto", desc: "Roles aprobados vuelven a estado pendiente tras días, perdiendo horas" },
                { name: "SCR no recoge asistencia", reports: 5, status: "2 pendientes", risk: "Activo", desc: "Incluye PARESA (en curso) y casos de INCIDENCIAS ENERO" },
                { name: "Error HE AGRUPADO", reports: 3, status: "Resuelto", risk: "Bajo", desc: "Calculaba montos duplicados para doctoras mensualeras" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                  background: i % 2 === 0 ? COLORS.grayLight : "#fff", borderRadius: 8, marginBottom: 4,
                }}>
                  <div style={{
                    width: 8, height: 40, borderRadius: 4, flexShrink: 0,
                    background: item.risk === "Activo" ? COLORS.red : item.risk === "Alto" ? COLORS.orange : COLORS.green,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray, marginTop: 2 }}>{item.desc}</div>
                  </div>
                  <div style={{ textAlign: "center", minWidth: 50 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.dark }}>{item.reports}</div>
                    <div style={{ fontSize: 9, color: COLORS.gray, textTransform: "uppercase" }}>reportes</div>
                  </div>
                  <div style={{
                    padding: "4px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600,
                    background: item.risk === "Activo" ? "#fde8e8" : item.risk === "Alto" ? "#fff3e0" : "#e8f5e9",
                    color: item.risk === "Activo" ? COLORS.red : item.risk === "Alto" ? COLORS.orange : COLORS.green,
                  }}>
                    {item.risk === "Activo" ? "⚠ Activo" : item.risk === "Alto" ? "⚡ Riesgo alto" : "✓ Resuelto"}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===== TAB: BLOQUEANTES ===== */}
        {tab === "bloqueantes" && (
          <>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
              <KPI value="37" label="Total Bloqueantes" color={COLORS.dark} />
              <KPI value="34" label="Resueltas" color={COLORS.green} sub="91.9%" />
              <KPI value="3" label="Aún Abiertas" color={COLORS.red} />
              <KPI value="~16" label="Personas Afectadas" color={COLORS.orange} sub="por pendientes" />
            </div>

            <SectionTitle number="1">Estado de Incidencias Bloqueantes</SectionTitle>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", flex: "1 1 250px", textAlign: "center" }}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={blockingData} cx="50%" cy="50%" outerRadius={85} innerRadius={50}
                      dataKey="value" labelLine={false} label={renderCustomLabel} strokeWidth={2} stroke="#fff">
                      {blockingData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ fontSize: 12, color: COLORS.gray, marginTop: 4 }}>
                  <span style={{ color: COLORS.green, fontWeight: 700 }}>91.9%</span> resueltas · <span style={{ color: COLORS.red, fontWeight: 700 }}>8.1%</span> pendientes
                </div>
              </div>

              <div style={{ flex: "1 1 350px", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark, marginBottom: 4 }}>3 Incidencias Bloqueantes Abiertas:</div>
                {pendingDetail.map((item, i) => (
                  <div key={i} style={{
                    background: "#fff", border: `1px solid ${COLORS.red}33`, borderLeft: `4px solid ${COLORS.red}`,
                    borderRadius: "0 8px 8px 0", padding: "12px 14px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark }}>{item.incidencia}</span>
                      <span style={{
                        background: "#fde8e8", color: COLORS.red, padding: "2px 8px",
                        borderRadius: 10, fontSize: 11, fontWeight: 700,
                      }}>{item.dias} días</span>
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.gray, marginTop: 4 }}>
                      {item.incidencia === "INCIDENCIAS ENERO" && "11 casos pendientes: SCR, liquidaciones a Gs. 0, monto CIT, reprocesamiento"}
                      {item.incidencia === "SCR PARESA" && "En curso — errores de cálculo en liquidación de funcionarios de sede PARESA"}
                      {item.incidencia === "PROCESAR ASISTENCIA" && "Error al reprocesar asistencia de 4 colaboradores (Romero, Avalos, Cabral, Canillas)"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SectionTitle number="2">Comparativo: Situación Histórica vs. Actual</SectionTitle>
            <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  { metric: "Bloqueantes activas", before: "30+", after: "3", improved: true },
                  { metric: "Grupos afectados", before: "6 grupos", after: "1 sede + 4 personas", improved: true },
                  { metric: "Tasa resolución", before: "~52%", after: "96.3%", improved: true },
                  { metric: "Incidencia más antigua", before: "146 días", after: "29 días", improved: true },
                ].map((item, i) => (
                  <div key={i} style={{ flex: "1 1 200px", padding: 16, background: COLORS.grayLight, borderRadius: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.gray, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      {item.metric}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.red, textDecoration: "line-through", opacity: 0.6 }}>{item.before}</div>
                      <div style={{ fontSize: 16, color: COLORS.gray }}>→</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.green }}>{item.after}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{
          marginTop: 32, padding: "16px 0", borderTop: `1px solid ${COLORS.bluePale}`,
          textAlign: "center", fontSize: 11, color: COLORS.gray,
        }}>
          Informe de Incidencias RRHH — Sistema Futura · Pablo Alcorta · 13 de febrero de 2026
        </div>
      </div>
    </div>
  );
}
