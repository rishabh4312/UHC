from pathlib import Path

path = Path('backend/database/initDb.js')
text = path.read_text(encoding='utf-8')
old = '''    }
});


// =====================================
'''
new = '''    }

    const hasLabReport = columns.some((column) => column.name === "lab_report");
    if (!hasLabReport) {
        db.run(`ALTER TABLE opd_visits ADD COLUMN lab_report TEXT`, (alterErr) => {
            if (alterErr) {
                console.log(alterErr.message);
            }
        });
    }
});


// =====================================
'''

if old not in text:
    raise SystemExit('old block missing')

path.write_text(text.replace(old, new), encoding='utf-8')
print('patched initDb.js')
