import html2pdf from 'html2pdf.js';

interface ExportMetadata {
    patientName?: string;
    sessionName: string;
    date: string;
    practitionerName?: string;
}

export const exportToPDF = async (elementOrId: string | HTMLElement, metadata: ExportMetadata) => {
    let element: HTMLElement | null = null;

    if (typeof elementOrId === 'string') {
        element = document.getElementById(elementOrId);

        // If not found in main document, it might be in Shadow DOM
        if (!element) {
            const widget = document.querySelector('clinisage-speech-widget');
            if (widget && widget.shadowRoot) {
                element = widget.shadowRoot.querySelector('#' + elementOrId) as HTMLElement;
            }
        }
    } else {
        element = elementOrId;
    }

    if (!element) {
        console.error('Element not found:', elementOrId);
        return false;
    }

    try {
        // Create a professional container for the PDF
        const container = document.createElement('div');
        container.style.padding = '0';
        container.style.width = '100%';
        container.style.backgroundColor = 'white';
        container.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        container.style.color = '#1e293b'; // slate-800

        // 1. Professional Header
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'flex-end';
        header.style.marginBottom = '20px';
        header.style.paddingBottom = '12px';
        header.style.borderBottom = '2px solid #7fb069';

        const logo = document.createElement('div');
        logo.innerHTML = `<span style="color: #7fb069; font-weight: 800; font-size: 24px; letter-spacing: -0.5px;">Clinisage.ai</span>`;
        header.appendChild(logo);

        const dateInfo = document.createElement('div');
        dateInfo.style.textAlign = 'right';
        dateInfo.style.fontSize = '11px';
        dateInfo.style.color = '#64748b';
        dateInfo.style.fontWeight = '500';
        dateInfo.innerText = `Generated on ${metadata.date}`;
        header.appendChild(dateInfo);

        container.appendChild(header);

        // 2. Metadata Section (Minimal)
        const infoSection = document.createElement('div');
        infoSection.style.display = 'flex';
        infoSection.style.flexWrap = 'wrap'; // Add wrap for long lists
        infoSection.style.gap = '24px'; // Better spacing
        infoSection.style.marginBottom = '32px';
        infoSection.style.fontSize = '12px';

        const addField = (label: string, value: string) => {
            const field = document.createElement('div');
            field.innerHTML = `<span style="color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">${label}:</span> <span style="color: #0f172a; font-weight: 600; margin-left: 4px;">${value}</span>`;
            infoSection.appendChild(field);
        };

        if (metadata.patientName && metadata.patientName !== 'Patient' && metadata.patientName !== 'Not Specified') {
            addField('Patient', metadata.patientName);
        }

        if (metadata.practitionerName && metadata.practitionerName !== 'Dr. Sarah Wilson') {
            addField('Practitioner', metadata.practitionerName);
        }

        if (infoSection.children.length > 0) {
            container.appendChild(infoSection);
        }

        // 3. Main Content Section
        const contentBody = document.createElement('div');
        // Inject the original HTML but clean it up
        let cleanHTML = element.innerHTML
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Fix bold markdown
            .replace(/^#+\s*(.*)/gm, '<h3>$1</h3>'); // Basic header fix if raw markdown exists

        contentBody.innerHTML = cleanHTML;

        // Apply professional typography to content
        const applyStyles = (selector: string, styles: Partial<CSSStyleDeclaration>) => {
            contentBody.querySelectorAll(selector).forEach((el: any) => {
                Object.assign(el.style, styles);
                // CRITICAL: Prevent page breaks inside paragraphs and headings
                el.style.pageBreakInside = 'avoid';
                if (selector.startsWith('h')) {
                    el.style.pageBreakAfter = 'avoid';
                }
            });
        };

        applyStyles('h1', { fontSize: '20px', fontWeight: '800', marginTop: '24px', marginBottom: '12px', color: '#0f172a', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' });
        applyStyles('h2', { fontSize: '17px', fontWeight: '700', marginTop: '20px', marginBottom: '10px', color: '#1e293b' });
        applyStyles('h3', { fontSize: '15px', fontWeight: '700', marginTop: '16px', marginBottom: '8px', color: '#334155' });
        applyStyles('p', { fontSize: '13px', lineHeight: '1.7', marginBottom: '12px', color: '#334155' });
        applyStyles('li', { fontSize: '13px', lineHeight: '1.7', marginBottom: '6px', color: '#334155' });
        applyStyles('ul', { paddingLeft: '20px', marginBottom: '12px' });
        applyStyles('strong', { fontWeight: '700', color: '#0f172a' });

        container.appendChild(contentBody);

        // 4. Professional Footer
        const footer = document.createElement('div');
        footer.style.marginTop = '48px';
        footer.style.paddingTop = '16px';
        footer.style.paddingBottom = '16px'; // Add padding to prevent clipping
        footer.style.borderTop = '1px solid #f1f5f9';
        footer.style.fontSize = '10px';
        footer.style.color = '#64748b'; // Darker for better visibility
        footer.style.textAlign = 'center';
        footer.style.lineHeight = '1.5';
        footer.innerText = 'Confidential Clinical Documentation - Generated by Clinisage.ai Secure Systems';
        container.appendChild(footer);

        // Add extra safe space at the very bottom of the document
        const safeSpace = document.createElement('div');
        safeSpace.style.height = '20px';
        container.appendChild(safeSpace);

        // 5. PDF Generation via html2pdf.js (Robust Paging & Margins)
        const opt = {
            margin: [15, 15, 15, 15] as [number, number, number, number], // [top, left, bottom, right] in mm
            filename: `${metadata.patientName || 'Session'}_${metadata.sessionName.replace(/\s+/g, '_')}_${metadata.date.replace(/\//g, '-')}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                dpi: 192
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Generate and Save
        await html2pdf().from(container).set(opt).save();

        return true;
    } catch (error) {
        console.error('Error generating professional PDF:', error);
        return false;
    }
};

