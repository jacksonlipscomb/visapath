import jsPDF from 'jspdf'
import { VISA_ROUTES, PHASE_LABELS } from '../data/visaRoutes'

const PAGE_W = 210
const PAGE_H = 297
const MARGIN_L = 15
const MARGIN_R = 195
const CONTENT_W = MARGIN_R - MARGIN_L
const BODY_BOTTOM = 282

export function generateChecklistPDF(routeId: string): void {
  const route = VISA_ROUTES.find(r => r.id === routeId)
  if (!route) {
    console.error(`generateChecklistPDF: route "${routeId}" not found`)
    return
  }

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
  let y = 20

  // ── helpers ──────────────────────────────────────────────────────────────

  const checkPage = (neededMm: number) => {
    if (y + neededMm > BODY_BOTTOM) {
      pdf.addPage()
      y = 20
    }
  }

  const wrappedText = (
    text: string,
    x: number,
    maxWidth: number,
    lineHeight: number,
    indent = 0,
  ): void => {
    const lines = pdf.splitTextToSize(text, maxWidth) as string[]
    for (const line of lines) {
      checkPage(lineHeight + 2)
      pdf.text(line, x + indent, y)
      y += lineHeight
    }
  }

  const sectionDivider = (label: string) => {
    checkPage(14)
    pdf.setDrawColor(0)
    pdf.setLineWidth(0.5)
    pdf.line(MARGIN_L, y, MARGIN_R, y)
    y += 6
    pdf.setFontSize(13)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(0, 0, 0)
    pdf.text(label, MARGIN_L, y)
    y += 7
  }

  // ── cover header ─────────────────────────────────────────────────────────

  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.text(
    `${route.origin.name} to ${route.destination.name} — ${route.visaType}`,
    MARGIN_L,
    y,
  )
  y += 8

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(80)
  pdf.text(
    `Processing: ${route.processingTime}   |   Stay: ${route.stayDuration}   |   Cost: ${route.estimatedCost}`,
    MARGIN_L,
    y,
  )
  pdf.setTextColor(0)
  y += 5

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'italic')
  pdf.setTextColor(60)
  const summaryLines = pdf.splitTextToSize(route.summary, CONTENT_W) as string[]
  for (const line of summaryLines) {
    pdf.text(line, MARGIN_L, y)
    y += 5
  }
  pdf.setTextColor(0)
  y += 4

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1 — ROADMAP
  // ═══════════════════════════════════════════════════════════════════════════

  sectionDivider('SECTION 1 — STEP-BY-STEP ROADMAP')

  for (const step of route.steps) {
    checkPage(18)

    // Step heading
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(0)
    pdf.text(`Step ${step.id}:  ${step.title}`, MARGIN_L, y)
    y += 5

    // Phase / time / cost meta line
    const phaseParts: string[] = [PHASE_LABELS[step.phase]]
    if (step.estimatedTime) phaseParts.push(`Time: ${step.estimatedTime}`)
    if (step.estimatedCost) phaseParts.push(`Cost: ${step.estimatedCost}`)

    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'italic')
    pdf.setTextColor(100)
    pdf.text(phaseParts.join('   |   '), MARGIN_L + 3, y)
    pdf.setTextColor(0)
    y += 5

    // Description
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    wrappedText(step.description, MARGIN_L + 3, CONTENT_W - 3, 5)
    y += 4
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2 — DOCUMENTS CHECKLIST
  // ═══════════════════════════════════════════════════════════════════════════

  sectionDivider('SECTION 2 — DOCUMENTS CHECKLIST')

  // Legend
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(80)
  pdf.text('[R] = Required    [O] = Optional but recommended', MARGIN_L, y)
  pdf.setTextColor(0)
  y += 8

  for (const step of route.steps) {
    const docs = step.documents
    if (docs.length === 0) continue

    checkPage(16)

    // Step sub-heading
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(0)
    pdf.text(`Step ${step.id} — ${step.title}`, MARGIN_L, y)
    y += 6

    for (const item of docs) {
      checkPage(10)

      // Checkbox square
      pdf.setDrawColor(0)
      pdf.setLineWidth(0.3)
      pdf.rect(MARGIN_L + 2, y - 3.8, 4, 4)

      // Document name + badge
      const badge = item.required ? '[R]' : '[O]'
      pdf.setFontSize(10)
      pdf.setFont('helvetica', item.required ? 'bold' : 'normal')
      pdf.setTextColor(0)
      pdf.text(`${badge}  ${item.name}`, MARGIN_L + 8, y)
      y += 5

      // Optional description
      if (item.description) {
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(90)
        wrappedText(item.description, MARGIN_L + 8, CONTENT_W - 10, 4.5)
        pdf.setTextColor(0)
      }

      // Optional whereToGet
      if (item.whereToGet) {
        checkPage(6)
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'italic')
        pdf.setTextColor(100)
        pdf.text(`Where to get: ${item.whereToGet}`, MARGIN_L + 8, y)
        pdf.setTextColor(0)
        y += 5
      }

      y += 2
    }

    y += 5
  }

  // ── page footers ─────────────────────────────────────────────────────────

  const totalPages: number = pdf.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFontSize(8)
    pdf.setTextColor(150)
    pdf.text(
      `VisaPath — ${route.origin.name} to ${route.destination.name} | ${route.visaType}`,
      MARGIN_L,
      PAGE_H - 7,
    )
    pdf.text(`Page ${i} of ${totalPages}`, PAGE_W - 30, PAGE_H - 7)
    pdf.setTextColor(0)
  }

  pdf.save(`${routeId}-checklist.pdf`)
}
