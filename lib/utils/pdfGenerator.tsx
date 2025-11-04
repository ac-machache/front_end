import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import type { SessionDetails } from '../types';
import { markdownToText, markdownToSegments } from './markdownToText';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#000',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 20,
    color: '#000',
  },
  subsectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    color: '#000',
  },
  label: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 11,
    marginBottom: 10,
    lineHeight: 1.6,
  },
  summary: {
    fontSize: 11,
    lineHeight: 1.7,
    marginTop: 8,
    textAlign: 'justify',
    color: '#000',
  },
  list: {
    marginLeft: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 10,
    marginBottom: 6,
    lineHeight: 1.6,
    textAlign: 'left',
    color: '#000',
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.7,
    marginBottom: 10,
    textAlign: 'justify',
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  borderBox: {
    border: '1pt solid #ddd',
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  grid: {
    flexDirection: 'row',
    marginBottom: 10,
    minHeight: 20,
  },
  gridLabel: {
    width: '30%',
    paddingRight: 10,
  },
  gridValue: {
    width: '70%',
    flexWrap: 'wrap',
  },
});

interface ReportPDFProps {
  reportDetails: SessionDetails;
}

const ReportPDFDocument: React.FC<ReportPDFProps> = ({ reportDetails }) => {
  const rpt = reportDetails.state?.RapportDeSortie;
  if (!rpt) return null;

  const main = rpt.main_report;
  const sd = rpt.strategic_dashboard;

  return (
    <Document>
      {/* First Page: Main Report */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Rapport de Visite</Text>

        {/* Main Report Section */}
        {main && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rapport principal</Text>
            <View>
              {main.title && (
                <View style={styles.grid}>
                  <View style={styles.gridLabel}>
                    <Text style={styles.label}>Titre</Text>
                  </View>
                  <View style={styles.gridValue}>
                    <Text style={styles.value}>{main.title}</Text>
                  </View>
                </View>
              )}
              {main.date_of_visit && (
                <View style={styles.grid}>
                  <View style={styles.gridLabel}>
                    <Text style={styles.label}>Date</Text>
                  </View>
                  <View style={styles.gridValue}>
                    <Text style={styles.value}>{main.date_of_visit}</Text>
                  </View>
                </View>
              )}
              {main.farmer && (
                <View style={styles.grid}>
                  <View style={styles.gridLabel}>
                    <Text style={styles.label}>Agriculteur</Text>
                  </View>
                  <View style={styles.gridValue}>
                    <Text style={styles.value}>{main.farmer}</Text>
                  </View>
                </View>
              )}
              {main.tc && (
                <View style={styles.grid}>
                  <View style={styles.gridLabel}>
                    <Text style={styles.label}>TC</Text>
                  </View>
                  <View style={styles.gridValue}>
                    <Text style={styles.value}>{main.tc}</Text>
                  </View>
                </View>
              )}
              {main.report_summary && (
                <View style={{ marginTop: 10, paddingTop: 10 }}>
                  <Text style={styles.label}>Résumé</Text>
                  <View style={{ marginTop: 5 }}>
                    <Text style={styles.summary}>
                      {markdownToSegments(main.report_summary || '').map((segment, idx) => (
                        <Text key={idx} style={{
                          ...(segment.bold ? styles.bold : {}),
                          ...(segment.italic ? styles.italic : {})
                        }}>
                          {segment.text}
                        </Text>
                      ))}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}
      </Page>

      {/* Second Page: Strategic Dashboard */}
      {sd && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>Tableau de bord stratégique</Text>

          {/* Proactive Insights */}
          {sd.proactive_insights && (
            <View style={styles.section}>
                <Text style={styles.subsectionTitle}>Synthèse proactive</Text>
                {sd.proactive_insights.identified_issues && sd.proactive_insights.identified_issues.length > 0 && (
                  <View>
                    <Text style={styles.label}>Points identifiés</Text>
                    <View style={styles.list}>
                      {sd.proactive_insights.identified_issues.map((item, idx) => {
                        const cleaned = markdownToText(item);
                        return (
                          <Text key={idx} style={styles.listItem}>• {cleaned}</Text>
                        );
                      })}
                    </View>
                  </View>
                )}
                {sd.proactive_insights.proposed_solutions && sd.proactive_insights.proposed_solutions.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.label}>Pistes/solutions</Text>
                    <View style={styles.list}>
                      {sd.proactive_insights.proposed_solutions.map((item, idx) => {
                        const cleaned = markdownToText(item);
                        return (
                          <Text key={idx} style={styles.listItem}>• {cleaned}</Text>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Action Plan */}
            {sd.action_plan && (
              <View style={styles.section}>
                <Text style={styles.subsectionTitle}>Plan d&apos;action</Text>
                {sd.action_plan.for_tc && sd.action_plan.for_tc.length > 0 && (
                  <View>
                    <Text style={styles.label}>Plan d&apos;action – TC</Text>
                    <View style={styles.list}>
                      {sd.action_plan.for_tc.map((item, idx) => {
                        const cleaned = markdownToText(item);
                        return (
                          <Text key={idx} style={styles.listItem}>• {cleaned}</Text>
                        );
                      })}
                    </View>
                  </View>
                )}
                {sd.action_plan.for_farmer && sd.action_plan.for_farmer.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.label}>Plan d&apos;action – Agriculteur</Text>
                    <View style={styles.list}>
                      {sd.action_plan.for_farmer.map((item, idx) => {
                        const cleaned = markdownToText(item);
                        return (
                          <Text key={idx} style={styles.listItem}>• {cleaned}</Text>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Opportunity Detector */}
            {sd.opportunity_detector && (
              <View style={styles.section}>
                <Text style={styles.subsectionTitle}>Détecteur d&apos;opportunités</Text>
                {sd.opportunity_detector.sales && sd.opportunity_detector.sales.length > 0 && (
                  <View>
                    <Text style={styles.label}>Opportunités (ventes)</Text>
                    <View style={styles.list}>
                      {sd.opportunity_detector.sales.map((item, idx) => {
                        const cleaned = markdownToText(item);
                        return (
                          <Text key={idx} style={styles.listItem}>• {cleaned}</Text>
                        );
                      })}
                    </View>
                  </View>
                )}
                {sd.opportunity_detector.advice && sd.opportunity_detector.advice.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.label}>Conseils</Text>
                    <View style={styles.list}>
                      {sd.opportunity_detector.advice.map((item, idx) => {
                        const cleaned = markdownToText(item);
                        return (
                          <Text key={idx} style={styles.listItem}>• {cleaned}</Text>
                        );
                      })}
                    </View>
                  </View>
                )}
                {sd.opportunity_detector.farmer_projects && sd.opportunity_detector.farmer_projects.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.label}>Projets agriculteur</Text>
                    <View style={styles.list}>
                      {sd.opportunity_detector.farmer_projects.map((item, idx) => {
                        const cleaned = markdownToText(item);
                        return (
                          <Text key={idx} style={styles.listItem}>• {cleaned}</Text>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Risk Analysis */}
            {sd.risk_analysis && (
              <View style={styles.section}>
                <Text style={styles.subsectionTitle}>Analyse des risques</Text>
                {sd.risk_analysis.commercial && sd.risk_analysis.commercial.length > 0 && (
                  <View>
                    <Text style={styles.label}>Risque commercial</Text>
                    <View style={styles.list}>
                      {sd.risk_analysis.commercial.map((item, idx) => {
                        const cleaned = markdownToText(item);
                        return (
                          <Text key={idx} style={styles.listItem}>• {cleaned}</Text>
                        );
                      })}
                    </View>
                  </View>
                )}
                {sd.risk_analysis.technical && sd.risk_analysis.technical.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.label}>Risque technique</Text>
                    <View style={styles.list}>
                      {sd.risk_analysis.technical.map((item, idx) => {
                        const cleaned = markdownToText(item);
                        return (
                          <Text key={idx} style={styles.listItem}>• {cleaned}</Text>
                        );
                      })}
                    </View>
                  </View>
                )}
                {sd.risk_analysis.weak_signals && sd.risk_analysis.weak_signals.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.label}>Signaux faibles</Text>
                    <View style={styles.list}>
                      {sd.risk_analysis.weak_signals.map((item, idx) => {
                        const cleaned = markdownToText(item);
                        return (
                          <Text key={idx} style={styles.listItem}>• {cleaned}</Text>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Relationship Barometer */}
            {sd.relationship_barometer && (
              <View style={styles.section}>
                <Text style={styles.subsectionTitle}>Baromètre de la relation</Text>
                {sd.relationship_barometer.satisfaction_points && sd.relationship_barometer.satisfaction_points.length > 0 && (
                  <View>
                    <Text style={styles.label}>Points de satisfaction</Text>
                    <View style={styles.list}>
                      {sd.relationship_barometer.satisfaction_points.map((item, idx) => {
                        const cleaned = markdownToText(item);
                        return (
                          <Text key={idx} style={styles.listItem}>• {cleaned}</Text>
                        );
                      })}
                    </View>
                  </View>
                )}
                {sd.relationship_barometer.frustration_points && sd.relationship_barometer.frustration_points.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.label}>Points de frustration</Text>
                    <View style={styles.list}>
                      {sd.relationship_barometer.frustration_points.map((item, idx) => {
                        const cleaned = markdownToText(item);
                        return (
                          <Text key={idx} style={styles.listItem}>• {cleaned}</Text>
                        );
                      })}
                    </View>
                  </View>
                )}
                {sd.relationship_barometer.personal_notes && sd.relationship_barometer.personal_notes.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.label}>Notes personnelles</Text>
                    <View style={styles.list}>
                      {sd.relationship_barometer.personal_notes.map((item, idx) => {
                        const cleaned = markdownToText(item);
                        return (
                          <Text key={idx} style={styles.listItem}>• {cleaned}</Text>
                        );
                      })}
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Next Contact Prep */}
            {sd.next_contact_prep && (
              <View style={styles.section}>
                <Text style={styles.subsectionTitle}>Préparation du prochain contact</Text>
                {sd.next_contact_prep.opening_topic && (
                  <View>
                    <Text style={styles.label}>Sujet d&apos;ouverture</Text>
                    <View style={{ marginTop: 3 }}>
                      <Text style={styles.value}>
                        {markdownToSegments(sd.next_contact_prep.opening_topic || '').map((segment, idx) => (
                          <Text key={idx} style={{
                            ...(segment.bold ? styles.bold : {}),
                            ...(segment.italic ? styles.italic : {})
                          }}>
                            {segment.text}
                          </Text>
                        ))}
                      </Text>
                    </View>
                  </View>
                )}
                {sd.next_contact_prep.next_visit_objective && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={styles.label}>Objectif de la prochaine visite</Text>
                    <View style={{ marginTop: 3 }}>
                      <Text style={styles.value}>
                        {markdownToSegments(sd.next_contact_prep.next_visit_objective || '').map((segment, idx) => (
                          <Text key={idx} style={{
                            ...(segment.bold ? styles.bold : {}),
                            ...(segment.italic ? styles.italic : {})
                          }}>
                            {segment.text}
                          </Text>
                        ))}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}
        </Page>
      )}
    </Document>
  );
};

export async function generateReportPDF(reportDetails: SessionDetails): Promise<Blob> {
  const doc = <ReportPDFDocument reportDetails={reportDetails} />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();
  return blob;
}

export async function downloadReportPDF(reportDetails: SessionDetails, filename?: string): Promise<void> {
  try {
    // Validate report data exists
    if (!reportDetails || !reportDetails.state?.RapportDeSortie) {
      throw new Error('Report data is missing or incomplete');
    }
    
    console.log('PDF Generator - Report details:', reportDetails);
    const blob = await generateReportPDF(reportDetails);
    console.log('PDF Generator - Blob created:', blob);
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `rapport-${reportDetails.id || 'session'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

