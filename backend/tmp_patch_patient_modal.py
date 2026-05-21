from pathlib import Path
path = Path('frontend/src/components/PatientDetailsModal.jsx')
text = path.read_text(encoding='utf-8')
old = '                                                            src={opd.lab_report}\n'
new = '                                                            src={resolveApiImageUrl(opd.lab_report)}\n'
if old not in text:
    raise SystemExit('old pattern not found')
text = text.replace(old, new, 1)
old2 = '                                                                onClick={() => openPreview(opd.lab_report, "Lab Report")}\n'
new2 = '                                                                onClick={() => openPreview(resolveApiImageUrl(opd.lab_report), "Lab Report")}\n'
if old2 not in text:
    raise SystemExit('old onClick pattern not found')
text = text.replace(old2, new2, 1)
old3 = '                                                                    href={opd.lab_report}\n'
new3 = '                                                                    href={resolveApiImageUrl(opd.lab_report)}\n'
if old3 not in text:
    raise SystemExit('old href pattern not found')
text = text.replace(old3, new3, 1)
path.write_text(text, encoding='utf-8')
print('patched PatientDetailsModal lab url')
