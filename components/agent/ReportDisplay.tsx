import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SessionDetails } from '@/lib/types';

interface ReportDisplayProps {
  reportDetails: SessionDetails | null;
  reportLoading: boolean;
}

export default function ReportDisplay({ reportDetails, reportLoading }: ReportDisplayProps) {
  const hasReport = !!reportDetails?.state?.RapportDeSortie;

  if (!hasReport || !reportDetails.state) {
    return null;
  }

  const rpt = reportDetails.state.RapportDeSortie;
  if (!rpt) {
    return null;
  }
  const main = rpt.main_report;
  const sd = rpt.strategic_dashboard;

  return (
    <div className="mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Rapport de Visite</CardTitle>
        </CardHeader>
        <CardContent>
          {reportLoading && <div className="text-sm text-muted-foreground">Chargement…</div>}
          {!reportLoading && (
            <div className="space-y-6 text-sm leading-relaxed">
              <section className="space-y-3">
                <h3 className="text-lg font-semibold">Rapport principal</h3>
                <div className="rounded-lg border p-4">
                  <dl className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-x-6 gap-y-3 items-start">
                    {(typeof main?.title === 'string' && main.title.trim() !== '') && (
                      <>
                        <dt className="text-xs md:text-[13px] uppercase tracking-wide text-muted-foreground">Titre</dt>
                        <dd className="text-sm font-medium">{main.title}</dd>
                      </>
                    )}
                    {(typeof main?.date_of_visit === 'string' && main.date_of_visit.trim() !== '') && (
                      <>
                        <dt className="text-xs md:text-[13px] uppercase tracking-wide text-muted-foreground">Date</dt>
                        <dd className="text-sm">{main.date_of_visit}</dd>
                      </>
                    )}
                    {(typeof main?.farmer === 'string' && main.farmer.trim() !== '') && (
                      <>
                        <dt className="text-xs md:text-[13px] uppercase tracking-wide text-muted-foreground">Agriculteur</dt>
                        <dd className="text-sm">{main.farmer}</dd>
                      </>
                    )}
                    {(typeof main?.tc === 'string' && main.tc.trim() !== '') && (
                      <>
                        <dt className="text-xs md:text-[13px] uppercase tracking-wide text-muted-foreground">TC</dt>
                        <dd className="text-sm">{main.tc}</dd>
                      </>
                    )}
                  </dl>
                  {(typeof main?.report_summary === 'string' && main.report_summary.trim() !== '') && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-sm font-medium mb-1">Résumé</div>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{main.report_summary}</p>
                    </div>
                  )}
                </div>
              </section>

              {sd && (
                <>
                  <h3 className="text-lg font-semibold">Tableau de bord stratégique</h3>
                  <div className="space-y-4">
                    {sd.proactive_insights && (
                      <section className="space-y-2 rounded-lg border p-4">
                        <h4 className="font-semibold">Synthèse proactive</h4>
                        {((sd.proactive_insights.identified_issues?.length ?? 0) > 0) && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Points identifiés</div>
                            <ul className="list-disc pl-5 md:pl-6 space-y-1">
                              {sd.proactive_insights.identified_issues?.map((i: string, idx: number) => (
                                <li key={`pi-ii-${idx}`}>{i}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {((sd.proactive_insights.proposed_solutions?.length ?? 0) > 0) && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Pistes/solutions</div>
                            <ul className="list-disc pl-5 md:pl-6 space-y-1">
                              {sd.proactive_insights.proposed_solutions?.map((i: string, idx: number) => (
                                <li key={`pi-ps-${idx}`}>{i}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </section>
                    )}

                    {sd.action_plan && (
                      <section className="space-y-2 rounded-lg border p-4">
                        <h4 className="font-semibold">Plan d’action</h4>
                        {((sd.action_plan.for_tc?.length ?? 0) > 0) && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Plan d’action – TC</div>
                            <ul className="list-disc pl-5 md:pl-6 space-y-1">
                              {sd.action_plan.for_tc?.map((i: string, idx: number) => (
                                <li key={`ap-tc-${idx}`}>{i}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {((sd.action_plan.for_farmer?.length ?? 0) > 0) && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Plan d’action – Agriculteur</div>
                            <ul className="list-disc pl-5 md:pl-6 space-y-1">
                              {sd.action_plan.for_farmer?.map((i: string, idx: number) => (
                                <li key={`ap-farmer-${idx}`}>{i}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </section>
                    )}

                    {sd.opportunity_detector && (
                      <section className="space-y-2 rounded-lg border p-4">
                        <h4 className="font-semibold">Détecteur d’opportunités</h4>
                        {((sd.opportunity_detector.sales?.length ?? 0) > 0) && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Opportunités (ventes)</div>
                            <ul className="list-disc pl-5 md:pl-6 space-y-1">
                              {sd.opportunity_detector.sales?.map((i: string, idx: number) => (
                                <li key={`od-sales-${idx}`}>{i}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {((sd.opportunity_detector.advice?.length ?? 0) > 0) && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Conseils</div>
                            <ul className="list-disc pl-5 md:pl-6 space-y-1">
                              {sd.opportunity_detector.advice?.map((i: string, idx: number) => (
                                <li key={`od-adv-${idx}`}>{i}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {((sd.opportunity_detector.farmer_projects?.length ?? 0) > 0) && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Projets agriculteur</div>
                            <ul className="list-disc pl-5 md:pl-6 space-y-1">
                              {sd.opportunity_detector.farmer_projects?.map((i: string, idx: number) => (
                                <li key={`od-fp-${idx}`}>{i}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </section>
                    )}

                    {sd.risk_analysis && (
                      <section className="space-y-2 rounded-lg border p-4">
                        <h4 className="font-semibold">Analyse des risques</h4>
                        {((sd.risk_analysis.commercial?.length ?? 0) > 0) && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Risque commercial</div>
                            <ul className="list-disc pl-5 md:pl-6 space-y-1">
                              {sd.risk_analysis.commercial?.map((i: string, idx: number) => (
                                <li key={`risk-com-${idx}`}>{i}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {((sd.risk_analysis.technical?.length ?? 0) > 0) && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Risque technique</div>
                            <ul className="list-disc pl-5 md:pl-6 space-y-1">
                              {sd.risk_analysis.technical?.map((i: string, idx: number) => (
                                <li key={`risk-tech-${idx}`}>{i}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {((sd.risk_analysis.weak_signals?.length ?? 0) > 0) && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Signaux faibles</div>
                            <ul className="list-disc pl-5 md:pl-6 space-y-1">
                              {sd.risk_analysis.weak_signals?.map((i: string, idx: number) => (
                                <li key={`risk-ws-${idx}`}>{i}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </section>
                    )}

                    {sd.relationship_barometer && (
                      <section className="space-y-2 rounded-lg border p-4">
                        <h4 className="font-semibold">Baromètre de la relation</h4>
                        {((sd.relationship_barometer.satisfaction_points?.length ?? 0) > 0) && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Points de satisfaction</div>
                            <ul className="list-disc pl-5 md:pl-6 space-y-1">
                              {sd.relationship_barometer.satisfaction_points?.map((i: string, idx: number) => (
                                <li key={`rel-sat-${idx}`}>{i}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {((sd.relationship_barometer.frustration_points?.length ?? 0) > 0) && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Points de frustration</div>
                            <ul className="list-disc pl-5 md:pl-6 space-y-1">
                              {sd.relationship_barometer.frustration_points?.map((i: string, idx: number) => (
                                <li key={`rel-frus-${idx}`}>{i}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {((sd.relationship_barometer.personal_notes?.length ?? 0) > 0) && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Notes personnelles</div>
                            <ul className="list-disc pl-5 md:pl-6 space-y-1">
                              {sd.relationship_barometer.personal_notes?.map((i: string, idx: number) => (
                                <li key={`rel-notes-${idx}`}>{i}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </section>
                    )}

                    {sd.next_contact_prep && (
                      <section className="space-y-2 rounded-lg border p-4">
                        <h4 className="font-semibold">Préparation du prochain contact</h4>
                        {(typeof sd.next_contact_prep.opening_topic === 'string' && sd.next_contact_prep.opening_topic.trim() !== '') && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Sujet d’ouverture</div>
                            <p className="text-sm whitespace-pre-wrap">{sd.next_contact_prep.opening_topic}</p>
                          </div>
                        )}
                        {(typeof sd.next_contact_prep.next_visit_objective === 'string' && sd.next_contact_prep.next_visit_objective.trim() !== '') && (
                          <div className="space-y-1">
                            <div className="text-sm font-medium">Objectif de la prochaine visite</div>
                            <p className="text-sm whitespace-pre-wrap">{sd.next_contact_prep.next_visit_objective}</p>
                          </div>
                        )}
                      </section>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}