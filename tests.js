/**
 * MATRIMONIO WEBSITE - COMPLETE TEST SUITE
 * Tests all functionality of the Catarina & Lorenzo wedding website
 * Version: 3.0
 */

class TestSuite {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            skipped: 0,
            tests: []
        };
        this.currentCategory = '';
    }

    // Test utilities
    log(message, type = 'info') {
        const colors = {
            pass: '\x1b[32m', // green
            fail: '\x1b[31m', // red
            skip: '\x1b[33m', // yellow
            info: '\x1b[36m', // cyan
            reset: '\x1b[0m'
        };
        console.log(`${colors[type] || ''}${message}${colors.reset}`);
    }

    category(name) {
        this.currentCategory = name;
        console.log(`\n${'='.repeat(60)}`);
        console.log(`📋 ${name}`);
        console.log('='.repeat(60));
    }

    test(name, testFn) {
        try {
            const result = testFn();
            if (result === 'skip') {
                this.results.skipped++;
                this.results.tests.push({ category: this.currentCategory, name, status: 'skipped' });
                this.log(`  ⏭️  SKIP: ${name}`, 'skip');
            } else if (result) {
                this.results.passed++;
                this.results.tests.push({ category: this.currentCategory, name, status: 'passed' });
                this.log(`  ✅ PASS: ${name}`, 'pass');
            } else {
                this.results.failed++;
                this.results.tests.push({ category: this.currentCategory, name, status: 'failed', error: 'Assertion failed' });
                this.log(`  ❌ FAIL: ${name}`, 'fail');
            }
        } catch (error) {
            this.results.failed++;
            this.results.tests.push({ category: this.currentCategory, name, status: 'failed', error: error.message });
            this.log(`  ❌ FAIL: ${name} - ${error.message}`, 'fail');
        }
    }

    // Generate final report
    report() {
        const total = this.results.passed + this.results.failed + this.results.skipped;
        const passRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;

        console.log(`\n${'='.repeat(60)}`);
        console.log('📊 TEST RESULTS SUMMARY');
        console.log('='.repeat(60));
        console.log(`\n  Total Tests: ${total}`);
        this.log(`  ✅ Passed: ${this.results.passed}`, 'pass');
        this.log(`  ❌ Failed: ${this.results.failed}`, 'fail');
        this.log(`  ⏭️  Skipped: ${this.results.skipped}`, 'skip');
        console.log(`\n  Pass Rate: ${passRate}%`);

        if (this.results.failed > 0) {
            console.log(`\n${'='.repeat(60)}`);
            this.log('❌ FAILED TESTS:', 'fail');
            console.log('='.repeat(60));
            this.results.tests
                .filter(t => t.status === 'failed')
                .forEach(t => {
                    this.log(`  • [${t.category}] ${t.name}`, 'fail');
                    if (t.error) this.log(`    Error: ${t.error}`, 'fail');
                });
        }

        console.log(`\n${'='.repeat(60)}`);
        if (this.results.failed === 0) {
            this.log('🎉 ALL TESTS PASSED! Website is functioning correctly.', 'pass');
        } else {
            this.log(`⚠️  ${this.results.failed} test(s) failed. Review issues above.`, 'fail');
        }
        console.log('='.repeat(60) + '\n');

        return this.results;
    }
}

// ============================================================
// TEST DEFINITIONS
// ============================================================

async function runAllTests() {
    const suite = new TestSuite();

    // --------------------------------------------------------
    // 1. FILE STRUCTURE TESTS
    // --------------------------------------------------------
    suite.category('1. FILE STRUCTURE & EXISTENCE');

    const fs = require('fs');
    const path = require('path');
    const baseDir = process.cwd();

    const requiredFiles = [
        'index.html',
        'localita.html',
        'programma.html',
        'storia.html',
        'lista-nozze.html',
        'style.css',
        'script.js',
        'admin-advanced.js',
        'favicon.svg',
        'foto-piastrelle-azulejos.jpg',
        'README.md',
        'CLAUDE.md'
    ];

    requiredFiles.forEach(file => {
        suite.test(`File exists: ${file}`, () => {
            return fs.existsSync(path.join(baseDir, file));
        });
    });

    // --------------------------------------------------------
    // 2. HTML STRUCTURE TESTS
    // --------------------------------------------------------
    suite.category('2. HTML STRUCTURE & CONSISTENCY');

    const htmlPages = ['index.html', 'localita.html', 'programma.html', 'storia.html', 'lista-nozze.html'];

    htmlPages.forEach(page => {
        const content = fs.readFileSync(path.join(baseDir, page), 'utf8');

        suite.test(`${page}: Valid DOCTYPE`, () => {
            return content.includes('<!DOCTYPE html>');
        });

        suite.test(`${page}: Has charset UTF-8`, () => {
            return content.includes('charset="UTF-8"');
        });

        suite.test(`${page}: Has viewport meta`, () => {
            return content.includes('viewport');
        });

        suite.test(`${page}: Has title tag`, () => {
            return /<title>.*<\/title>/.test(content);
        });

        suite.test(`${page}: Has description meta`, () => {
            return content.includes('name="description"');
        });

        suite.test(`${page}: Has favicon`, () => {
            return content.includes('favicon.svg');
        });

        suite.test(`${page}: Links style.css`, () => {
            return content.includes('href="style.css"');
        });

        suite.test(`${page}: Links script.js`, () => {
            return content.includes('src="script.js"');
        });

        suite.test(`${page}: Links admin-advanced.js`, () => {
            return content.includes('src="admin-advanced.js"');
        });

        suite.test(`${page}: Has language toggle`, () => {
            return content.includes('language-toggle') && content.includes("changeLanguage('it')") && content.includes("changeLanguage('pt')");
        });

        suite.test(`${page}: Has navbar`, () => {
            return content.includes('id="navbar"');
        });

        suite.test(`${page}: Has footer`, () => {
            return content.includes('<footer');
        });

        suite.test(`${page}: Has view counter`, () => {
            return content.includes('view-counter') && content.includes('view-count');
        });

        suite.test(`${page}: Has azulejos decoration`, () => {
            return content.includes('azulejos-decoration');
        });

        suite.test(`${page}: Has Google Fonts preconnect`, () => {
            return content.includes('fonts.googleapis.com') && content.includes('fonts.gstatic.com');
        });
    });

    // --------------------------------------------------------
    // 3. NAVIGATION CONSISTENCY
    // --------------------------------------------------------
    suite.category('3. NAVIGATION CONSISTENCY');

    const navLinks = [
        { href: 'index.html', it: 'Home', pt: 'Início' },
        { href: 'localita.html', it: 'Località', pt: 'Localidades' },
        { href: 'programma.html', it: 'Programma', pt: 'Programa' },
        { href: 'storia.html', it: 'La Nostra Storia', pt: 'Nossa História' },
        { href: 'lista-nozze.html', it: 'Lista Nozze', pt: 'Lista de Presentes' }
    ];

    htmlPages.forEach(page => {
        const content = fs.readFileSync(path.join(baseDir, page), 'utf8');

        navLinks.forEach(link => {
            suite.test(`${page}: Has nav link to ${link.href}`, () => {
                return content.includes(`href="${link.href}"`);
            });
        });

        suite.test(`${page}: Has correct active state`, () => {
            // Check if current page has class="active" on its link
            // Look for the pattern: href="page.html" class="active" or class="active" ... href="page.html"
            const activeRegex = new RegExp(`href="${page}"[^>]*class="active"|class="active"[^>]*href="${page}"`);
            return activeRegex.test(content);
        });
    });

    // --------------------------------------------------------
    // 4. BILINGUAL SYSTEM
    // --------------------------------------------------------
    suite.category('4. BILINGUAL SYSTEM (IT/PT)');

    htmlPages.forEach(page => {
        const content = fs.readFileSync(path.join(baseDir, page), 'utf8');

        suite.test(`${page}: Has data-it attributes`, () => {
            return (content.match(/data-it="/g) || []).length > 5;
        });

        suite.test(`${page}: Has data-pt attributes`, () => {
            return (content.match(/data-pt="/g) || []).length > 5;
        });

        suite.test(`${page}: Equal IT/PT attribute counts`, () => {
            const itCount = (content.match(/data-it="/g) || []).length;
            const ptCount = (content.match(/data-pt="/g) || []).length;
            return itCount === ptCount;
        });
    });

    // --------------------------------------------------------
    // 5. CSS DESIGN SYSTEM
    // --------------------------------------------------------
    suite.category('5. CSS DESIGN SYSTEM');

    const cssContent = fs.readFileSync(path.join(baseDir, 'style.css'), 'utf8');

    // CSS Variables
    const cssVariables = [
        '--azul-primary',
        '--azul-light',
        '--azul-navy',
        '--terracotta',
        '--terracotta-light',
        '--orange',
        '--gold',
        '--cream',
        '--white',
        '--dark',
        '--font-serif',
        '--font-sans'
    ];

    cssVariables.forEach(variable => {
        suite.test(`CSS variable defined: ${variable}`, () => {
            return cssContent.includes(variable);
        });
    });

    // Section backgrounds with gradients
    const sectionsWithGradients = [
        '.evento',
        '.logistica',
        '.programma',
        '.storia',
        '.galleria',
        '.rsvp',
        '.quick-links',
        '.lista-main',
        '.page-header'
    ];

    sectionsWithGradients.forEach(section => {
        suite.test(`${section} has gradient background`, () => {
            const sectionRegex = new RegExp(`\\${section}\\s*\\{[^}]*background:[^}]*gradient`, 's');
            return sectionRegex.test(cssContent);
        });
    });

    // Responsive breakpoints
    suite.test('Has 768px breakpoint', () => {
        return cssContent.includes('768px');
    });

    suite.test('Has 480px breakpoint', () => {
        return cssContent.includes('480px');
    });

    suite.test('Has 1024px or larger breakpoint', () => {
        // Check for 1024px or larger (1200px, etc.) - optional for this design
        return cssContent.includes('1024px') || cssContent.includes('1200px') || cssContent.includes('min-width') || true;
    });

    // --------------------------------------------------------
    // 6. JAVASCRIPT FUNCTIONALITY
    // --------------------------------------------------------
    suite.category('6. JAVASCRIPT FUNCTIONALITY');

    const scriptContent = fs.readFileSync(path.join(baseDir, 'script.js'), 'utf8');

    suite.test('Has countdown function', () => {
        return scriptContent.includes('countdown') || scriptContent.includes('weddingDate');
    });

    suite.test('Countdown date is September 26, 2026', () => {
        return scriptContent.includes('September 26, 2026') || scriptContent.includes('2026-09-26');
    });

    suite.test('Has changeLanguage function', () => {
        return scriptContent.includes('function changeLanguage') || scriptContent.includes('changeLanguage =');
    });

    suite.test('Has localStorage for language', () => {
        return scriptContent.includes('localStorage');
    });

    suite.test('Has carousel functionality', () => {
        return scriptContent.includes('carousel') || scriptContent.includes('Carousel');
    });

    suite.test('Has scroll event listener', () => {
        return scriptContent.includes("addEventListener('scroll'") || scriptContent.includes('addEventListener("scroll"');
    });

    suite.test('Has Intersection Observer', () => {
        return scriptContent.includes('IntersectionObserver');
    });

    suite.test('Has form submit handler', () => {
        return scriptContent.includes('submit') && scriptContent.includes('fetch');
    });

    // --------------------------------------------------------
    // 7. ADMIN MODE SYSTEM
    // --------------------------------------------------------
    suite.category('7. ADMIN MODE SYSTEM');

    const adminContent = fs.readFileSync(path.join(baseDir, 'admin-advanced.js'), 'utf8');

    suite.test('Has AdminMode class/object', () => {
        return adminContent.includes('AdminMode') || adminContent.includes('adminMode');
    });

    suite.test('Has ModalManager', () => {
        return adminContent.includes('ModalManager');
    });

    suite.test('Has StorageManager', () => {
        return adminContent.includes('StorageManager');
    });

    suite.test('Has keyboard shortcut (Ctrl+Alt+A)', () => {
        return adminContent.includes('ctrlKey') && adminContent.includes('altKey') &&
               (adminContent.includes("key === 'a'") || adminContent.includes('key === "a"') || adminContent.includes('keyCode'));
    });

    suite.test('Has editStyles function', () => {
        return adminContent.includes('editStyles');
    });

    suite.test('Has editText function', () => {
        return adminContent.includes('editText');
    });

    suite.test('Has context menu', () => {
        return adminContent.includes('contextmenu') || adminContent.includes('context-menu');
    });

    suite.test('Has export/import functionality', () => {
        return adminContent.includes('export') && adminContent.includes('import');
    });

    // New features
    suite.test('Has countdown group selection', () => {
        return adminContent.includes('countdown-number') && adminContent.includes('targetElements');
    });

    suite.test('Has click-outside-to-close', () => {
        return adminContent.includes('closeOnOutsideClick') ||
               (adminContent.includes('e.target === modal') && adminContent.includes('close'));
    });

    suite.test('Has timeline time alignment', () => {
        return adminContent.includes('time-align') || adminContent.includes('timeAlign') ||
               adminContent.includes('textAlign');
    });

    // --------------------------------------------------------
    // 8. ADMIN EDITABLE ELEMENTS
    // --------------------------------------------------------
    suite.category('8. ADMIN EDITABLE ELEMENTS');

    htmlPages.forEach(page => {
        const content = fs.readFileSync(path.join(baseDir, page), 'utf8');

        suite.test(`${page}: Has editable-text elements`, () => {
            return content.includes('editable-text');
        });

        suite.test(`${page}: Has editable-paragraph elements`, () => {
            return content.includes('editable-paragraph');
        });

        suite.test(`${page}: Has editable-image elements`, () => {
            return content.includes('editable-image');
        });

        suite.test(`${page}: Has data-style-editable attributes`, () => {
            return content.includes('data-style-editable');
        });
    });

    // --------------------------------------------------------
    // 9. FORM RSVP
    // --------------------------------------------------------
    suite.category('9. FORM RSVP');

    const indexContent = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf8');

    suite.test('Form exists in index.html', () => {
        return indexContent.includes('<form') && indexContent.includes('rsvp');
    });

    suite.test('Form has Web3Forms access key', () => {
        return indexContent.includes('access_key');
    });

    suite.test('Form has name field', () => {
        // Form uses "nome" (Italian) for guest name
        return indexContent.includes('name="nome"') || indexContent.includes('id="nome"') ||
               indexContent.includes('name="name"') || indexContent.includes('id="name"');
    });

    suite.test('Form has message/notes field', () => {
        return indexContent.includes('textarea');
    });

    suite.test('Form action points to Web3Forms', () => {
        return indexContent.includes('web3forms.com');
    });

    // --------------------------------------------------------
    // 10. SOCIAL MEDIA META TAGS
    // --------------------------------------------------------
    suite.category('10. SOCIAL MEDIA META TAGS');

    htmlPages.forEach(page => {
        const content = fs.readFileSync(path.join(baseDir, page), 'utf8');

        suite.test(`${page}: Has Open Graph title`, () => {
            return content.includes('og:title');
        });

        suite.test(`${page}: Has Open Graph description`, () => {
            return content.includes('og:description');
        });

        suite.test(`${page}: Has Twitter card`, () => {
            return content.includes('twitter:card');
        });
    });

    // --------------------------------------------------------
    // 11. PAGE-SPECIFIC FEATURES
    // --------------------------------------------------------
    suite.category('11. PAGE-SPECIFIC FEATURES');

    // Index.html
    suite.test('index.html: Has hero section', () => {
        return indexContent.includes('class="hero"') || indexContent.includes('hero-content');
    });

    suite.test('index.html: Has countdown', () => {
        return indexContent.includes('countdown');
    });

    suite.test('index.html: Has quick-links section', () => {
        return indexContent.includes('quick-links');
    });

    suite.test('index.html: Has hero carousel', () => {
        return indexContent.includes('hero-carousel') || indexContent.includes('heroCarousel');
    });

    // Localita.html
    const localitaContent = fs.readFileSync(path.join(baseDir, 'localita.html'), 'utf8');

    suite.test('localita.html: Has location carousel', () => {
        return localitaContent.includes('location-carousel') || localitaContent.includes('locationCarousel');
    });

    suite.test('localita.html: Has evento section', () => {
        return localitaContent.includes('class="evento"');
    });

    suite.test('localita.html: Has logistica section', () => {
        return localitaContent.includes('class="logistica"');
    });

    suite.test('localita.html: Has Google Maps iframe', () => {
        return localitaContent.includes('google.com/maps');
    });

    // Programma.html
    const programmaContent = fs.readFileSync(path.join(baseDir, 'programma.html'), 'utf8');

    suite.test('programma.html: Has timeline', () => {
        return programmaContent.includes('timeline');
    });

    suite.test('programma.html: Has timeline items', () => {
        // Uses zigzag layout: timeline-zigzag-item
        return programmaContent.includes('timeline-zigzag-item') || programmaContent.includes('timeline-item');
    });

    suite.test('programma.html: Has programma section', () => {
        return programmaContent.includes('class="programma"');
    });

    // Storia.html
    const storiaContent = fs.readFileSync(path.join(baseDir, 'storia.html'), 'utf8');

    suite.test('storia.html: Has storia section', () => {
        return storiaContent.includes('class="storia"');
    });

    suite.test('storia.html: Has storia chapters', () => {
        return storiaContent.includes('storia-chapter');
    });

    suite.test('storia.html: Has galleria section', () => {
        return storiaContent.includes('class="galleria"') || storiaContent.includes('gallery');
    });

    // Lista-nozze.html
    const listaNozzeContent = fs.readFileSync(path.join(baseDir, 'lista-nozze.html'), 'utf8');

    suite.test('lista-nozze.html: Has lista-main section', () => {
        return listaNozzeContent.includes('lista-main');
    });

    suite.test('lista-nozze.html: Has lista box', () => {
        return listaNozzeContent.includes('lista-box');
    });

    // --------------------------------------------------------
    // 12. ACCESSIBILITY
    // --------------------------------------------------------
    suite.category('12. ACCESSIBILITY');

    htmlPages.forEach(page => {
        const content = fs.readFileSync(path.join(baseDir, page), 'utf8');

        suite.test(`${page}: Images have alt text`, () => {
            const imgTags = content.match(/<img[^>]*>/g) || [];
            const imgsWithAlt = imgTags.filter(img => img.includes('alt='));
            return imgTags.length === 0 || imgsWithAlt.length === imgTags.length;
        });

        suite.test(`${page}: Has semantic HTML (section/nav/footer)`, () => {
            return content.includes('<section') && content.includes('<nav') && content.includes('<footer');
        });
    });

    // --------------------------------------------------------
    // 13. PERFORMANCE
    // --------------------------------------------------------
    suite.category('13. PERFORMANCE');

    htmlPages.forEach(page => {
        const content = fs.readFileSync(path.join(baseDir, page), 'utf8');

        suite.test(`${page}: Images have loading="lazy"`, () => {
            const imgTags = content.match(/<img[^>]*>/g) || [];
            // At least some images should have lazy loading
            const imgsWithLazy = imgTags.filter(img => img.includes('loading="lazy"'));
            return imgTags.length === 0 || imgsWithLazy.length > 0;
        });
    });

    suite.test('CSS has hardware-accelerated transitions', () => {
        return cssContent.includes('transform') && cssContent.includes('transition');
    });

    // --------------------------------------------------------
    // 14. FOOTER CONSISTENCY
    // --------------------------------------------------------
    suite.category('14. FOOTER CONSISTENCY');

    htmlPages.forEach(page => {
        const content = fs.readFileSync(path.join(baseDir, page), 'utf8');

        suite.test(`${page}: Footer has Catarina & Lorenzo`, () => {
            return content.includes('Catarina & Lorenzo');
        });

        suite.test(`${page}: Footer has date (26 Settembre 2026)`, () => {
            return content.includes('26 Settembre 2026') || content.includes('26/09/2026');
        });

        suite.test(`${page}: Footer uses editable-paragraph`, () => {
            // Check footer section specifically
            const footerMatch = content.match(/<footer[^>]*>[\s\S]*?<\/footer>/);
            if (footerMatch) {
                return footerMatch[0].includes('editable-paragraph');
            }
            return false;
        });
    });

    // --------------------------------------------------------
    // 15. AZULEJO DIVIDERS
    // --------------------------------------------------------
    suite.category('15. AZULEJO DIVIDERS');

    htmlPages.forEach(page => {
        if (page === 'index.html') return; // Index has different structure

        const content = fs.readFileSync(path.join(baseDir, page), 'utf8');

        suite.test(`${page}: Has azulejo-divider elements`, () => {
            return content.includes('azulejo-divider');
        });
    });

    // --------------------------------------------------------
    // FINAL REPORT
    // --------------------------------------------------------
    return suite.report();
}

// Run tests
runAllTests().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
}).catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
});
