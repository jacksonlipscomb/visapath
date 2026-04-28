import { useTranslation } from 'react-i18next'
import type { VisaRoute, VisaStep, DocumentItem } from '../data/visaRoutes'

export function useTranslatedRoute(route: VisaRoute | undefined): VisaRoute | undefined {
  const { t, i18n } = useTranslation('routes')

  if (!route || i18n.language !== 'sv') return route

  const r = route.id

  function ts(key: string, fallback: string): string {
    return t(key, { defaultValue: fallback }) as string
  }

  function translateStep(step: VisaStep, stepIndex: number): VisaStep {
    const sp = `${r}.steps.${stepIndex}`

    const documents: DocumentItem[] = step.documents.map((doc, di) => ({
      ...doc,
      name: ts(`${sp}.documents.${di}.name`, doc.name),
      ...(doc.description !== undefined && {
        description: ts(`${sp}.documents.${di}.description`, doc.description),
      }),
      ...(doc.whereToGet !== undefined && {
        whereToGet: ts(`${sp}.documents.${di}.whereToGet`, doc.whereToGet),
      }),
    }))

    const tips = step.tips?.map((tip, ti) => ts(`${sp}.tips.${ti}`, tip))

    const interviewPrep = step.interviewPrep
      ? {
          whatToBring: step.interviewPrep.whatToBring.map((w, wi) => ({
            item: ts(`${sp}.interviewPrep.whatToBring.${wi}.item`, w.item),
            ...(w.note !== undefined && {
              note: ts(`${sp}.interviewPrep.whatToBring.${wi}.note`, w.note),
            }),
          })),
          commonQuestions: step.interviewPrep.commonQuestions?.map((q, qi) =>
            ts(`${sp}.interviewPrep.commonQuestions.${qi}`, q)
          ),
          tips: step.interviewPrep.tips?.map((tip, ti) =>
            ts(`${sp}.interviewPrep.tips.${ti}`, tip)
          ),
        }
      : undefined

    return {
      ...step,
      title: ts(`${sp}.title`, step.title),
      description: ts(`${sp}.description`, step.description),
      ...(step.estimatedTime !== undefined && {
        estimatedTime: ts(`${sp}.estimatedTime`, step.estimatedTime),
      }),
      ...(step.estimatedCost !== undefined && {
        estimatedCost: ts(`${sp}.estimatedCost`, step.estimatedCost),
      }),
      documents,
      ...(tips !== undefined && { tips }),
      ...(interviewPrep !== undefined && { interviewPrep }),
    }
  }

  return {
    ...route,
    visaType: ts(`${r}.visaType`, route.visaType),
    processingTime: ts(`${r}.processingTime`, route.processingTime),
    stayDuration: ts(`${r}.stayDuration`, route.stayDuration),
    estimatedCost: ts(`${r}.estimatedCost`, route.estimatedCost),
    summary: ts(`${r}.summary`, route.summary),
    ...(route.athleteNote !== undefined && {
      athleteNote: ts(`${r}.athleteNote`, route.athleteNote),
    }),
    steps: route.steps.map((step, i) => translateStep(step, i)),
  }
}
