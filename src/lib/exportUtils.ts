import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportMetadata {
    patientName?: string;
    sessionName: string;
    date: string;
    practitionerName?: string;
}

const cleanTextNodes = (element: HTMLElement) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
    let node;
    while (node = walker.nextNode()) {
        if (node.nodeValue) {
            // Remove ** around text, # at start, etc. if they exist
            node.nodeValue = node.nodeValue
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/^#+\s*/, '')
                .replace(/__|_(.*?)_/g, '$1');
        }
    }
};

export const exportToPDF = async (elementId: string, metadata: ExportMetadata) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Element not found:', elementId);
        return;
    }

    try {
        // Create a temporary container for the PDF content to style it professionally
        // A4 width in px at 96dpi is approx 794px. We use this as base.
        const container = document.createElement('div');
        container.style.width = '794px';
        container.style.minHeight = '1123px'; // A4 height
        container.style.padding = '48px'; // ~12.7mm margins
        container.style.paddingBottom = '96px'; // Extra padding at bottom to prevent cutoff
        container.style.backgroundColor = 'white';
        container.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        container.style.color = '#111827'; // gray-900
        container.style.lineHeight = '1.6';
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        // Enable font smoothing for sharper text
        container.style.cssText += '-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;';

        // Header with Branding
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '40px';
        header.style.borderBottom = '2px solid #7fb069';
        header.style.paddingBottom = '20px';

        const logo = document.createElement('div');
        logo.innerHTML = `<span style="color: #7fb069; font-weight: 800; font-size: 28px; letter-spacing: -0.5px;">Clinisage.ai</span>`;
        header.appendChild(logo);

        const dateInfo = document.createElement('div');
        dateInfo.style.textAlign = 'right';
        dateInfo.style.fontSize = '12px';
        dateInfo.style.color = '#666';
        dateInfo.innerText = `Date: ${metadata.date}`;
        header.appendChild(dateInfo);

        container.appendChild(header);

        // Document Title

        // Patient Info Section
        const infoSection = document.createElement('div');
        infoSection.style.backgroundColor = '#f9fafb'; // gray-50
        infoSection.style.padding = '20px';
        infoSection.style.borderRadius = '12px';
        infoSection.style.marginBottom = '40px';
        infoSection.style.border = '1px solid #e5e7eb'; // gray-200
        infoSection.style.display = 'grid';
        infoSection.style.gridTemplateColumns = 'repeat(2, 1fr)';
        infoSection.style.gap = '16px';
        infoSection.style.fontSize = '14px';

        const addField = (label: string, value: string) => {
            const field = document.createElement('div');
            field.innerHTML = `<div style="color: #6b7280; font-size: 12px; margin-bottom: 4px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">${label}</div><div style="color: #111827; font-weight: 600;">${value || 'N/A'}</div>`;
            infoSection.appendChild(field);
        };

        addField('Patient', metadata.patientName || 'Not Specified');
        if (metadata.practitionerName) addField('Practitioner', metadata.practitionerName);

        container.appendChild(infoSection);

        // Content Section
        const contentBody = document.createElement('div');
        contentBody.className = 'pdf-content-body';
        contentBody.innerHTML = element.innerHTML;

        // Clean potential leftover markdown artifacts
        cleanTextNodes(contentBody);

        // Apply some styles to content tags
        const styleContent = (selector: string, styles: Partial<CSSStyleDeclaration>) => {
            contentBody.querySelectorAll(selector).forEach((el: any) => {
                Object.assign(el.style, styles);
            });
        };

        // Improved typography for content
        styleContent('h1', { fontSize: '20px', fontWeight: '700', marginTop: '32px', marginBottom: '16px', color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' });
        styleContent('h2', { fontSize: '18px', fontWeight: '600', marginTop: '24px', marginBottom: '12px', color: '#374151' });
        styleContent('h3', { fontSize: '16px', fontWeight: '600', marginTop: '20px', marginBottom: '10px', color: '#374151' });
        styleContent('p', { marginBottom: '16px', fontSize: '14px', lineHeight: '1.7', color: '#374151' });
        styleContent('strong', { fontWeight: '700', color: '#111827' });
        styleContent('ul', { paddingLeft: '24px', marginBottom: '16px' });
        styleContent('li', { marginBottom: '8px', fontSize: '14px', lineHeight: '1.7', color: '#374151' });
        styleContent('div', { marginBottom: '8px', fontSize: '14px', lineHeight: '1.7', color: '#374151' });

        container.appendChild(contentBody);

        // Footer
        const footer = document.createElement('div');
        footer.style.marginTop = '60px';
        footer.style.borderTop = '1px solid #e5e7eb';
        footer.style.paddingTop = '16px';
        footer.style.fontSize = '10px';
        footer.style.color = '#9ca3af';
        footer.style.textAlign = 'center';
        footer.style.fontStyle = 'italic';
        footer.innerText = 'Generated by Clinisage.ai - Secure Clinical Documentation System';
        container.appendChild(footer);

        // Add to body temporarily to render
        document.body.appendChild(container);

        // Capture with html2canvas with timeout
        const canvasPromise = html2canvas(container, {
            scale: 2, // Slightly lower scale for better performance, still good quality
            useCORS: true,
            logging: false,
            backgroundColor: 'white',
            windowWidth: 794,
            onclone: (clonedDoc) => {
                const clonedContainer = clonedDoc.querySelector('div') as HTMLElement;
                if (clonedContainer) clonedContainer.style.display = 'block';
            }
        });

        // 15s timeout to prevent infinite stuck loader
        const timeoutPromise = new Promise<HTMLCanvasElement>((_, reject) =>
            setTimeout(() => reject(new Error('PDF generation timed out')), 15000)
        );

        const canvas = await Promise.race([canvasPromise, timeoutPromise]);

        // Remove temp container
        document.body.removeChild(container);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Handle multiple pages if needed
        let heightLeft = pdfHeight;

        // Page 1: Full A4 height (no top margin needed usually for the first page image start)
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        let heightUsed = 297; // Amount of image vertical height we have already put on pages (A4 height)
        heightLeft -= 297;

        while (heightLeft > 0) {
            pdf.addPage();

            // For subsequent pages, we want a top margin so content doesn't hit the edge
            const topMargin = 20; // 20mm top margin

            // We want the image slice starting at 'heightUsed' (source Y) to appear at 'topMargin' (dest Y)
            // position = destY - sourceY
            const position = topMargin - heightUsed;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);

            // The amount of distinct image content we fit on this page is reduced by the margin
            const contentHeightOnPage = 297 - topMargin;

            heightLeft -= contentHeightOnPage;
            heightUsed += contentHeightOnPage;
        }

        // Save the PDF
        const safeSessionName = metadata.sessionName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${metadata.patientName || 'Session'}_${safeSessionName}_${metadata.date.replace(/\//g, '-')}.pdf`;
        pdf.save(filename);

        return true;
    } catch (error) {
        console.error('Error exporting PDF:', error);
        return false;
    }
};
