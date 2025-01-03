// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="introduction.html"><strong aria-hidden="true">1.</strong> Introduction</a></li><li class="chapter-item expanded affix "><li class="part-title">User Guides</li><li class="chapter-item expanded "><a href="user_guide_install_docker.html"><strong aria-hidden="true">2.</strong> Install docker</a></li><li class="chapter-item expanded "><a href="user_guide_install_host.html"><strong aria-hidden="true">3.</strong> Install host</a></li><li class="chapter-item expanded "><a href="install_nats_server.html"><strong aria-hidden="true">4.</strong> Install NATS Server</a></li><li class="chapter-item expanded affix "><li class="part-title">Core ctrl</li><li class="chapter-item expanded "><a href="core_messaging_overview.html"><strong aria-hidden="true">5.</strong> Messaging</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="core_messaging_message_fields.html"><strong aria-hidden="true">5.1.</strong> Message fields</a></li><li class="chapter-item expanded "><a href="core_messaging_jetstream.html"><strong aria-hidden="true">5.2.</strong> Message jetstream/broadcast</a></li><li class="chapter-item expanded "><a href="core_request_methods.html"><strong aria-hidden="true">5.3.</strong> Request Methods</a></li><li class="chapter-item expanded "><a href="core_messaging_CTRL_DATA.html"><strong aria-hidden="true">5.4.</strong> {{CTRL_DATA}} variable</a></li><li class="chapter-item expanded "><a href="core_messaging_CTRL_FILE.html"><strong aria-hidden="true">5.5.</strong> {{CTRL_FILE}} variable</a></li></ol></li><li class="chapter-item expanded "><a href="core_nats_timeouts.html"><strong aria-hidden="true">6.</strong> Nats timeouts</a></li><li class="chapter-item expanded "><a href="core_startup_folder.html"><strong aria-hidden="true">7.</strong> Startup folder</a></li><li class="chapter-item expanded "><a href="core_errors.html"><strong aria-hidden="true">8.</strong> Errors</a></li><li class="chapter-item expanded "><a href="core_central.html"><strong aria-hidden="true">9.</strong> central</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="core_hello_messages.html"><strong aria-hidden="true">9.1.</strong> hello messages</a></li><li class="chapter-item expanded "><a href="core_signing_keys.html"><strong aria-hidden="true">9.2.</strong> signing keys</a></li><li class="chapter-item expanded "><a href="core_acl.html"><strong aria-hidden="true">9.3.</strong> ACL</a></li><li class="chapter-item expanded "><a href="core_audit_log.html"><strong aria-hidden="true">9.4.</strong> audit log</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Examples standard messages</li><li class="chapter-item expanded "><a href="example_standard_reqhttpget.html"><strong aria-hidden="true">10.</strong> Http Get</a></li><li class="chapter-item expanded "><a href="example_standard_reqtailfile.html"><strong aria-hidden="true">11.</strong> Tail File</a></li><li class="chapter-item expanded "><a href="example_standard_reqclicommand.html"><strong aria-hidden="true">12.</strong> Cli Command</a></li><li class="chapter-item expanded "><a href="example_standard_reqclicommandcont.html"><strong aria-hidden="true">13.</strong> Cli Command Continously</a></li><li class="chapter-item expanded "><a href="example_standard_reqcopysrc.html"><strong aria-hidden="true">14.</strong> Copy Src to Dst</a></li><li class="chapter-item expanded "><a href="example_standard_send_more_messages.html"><strong aria-hidden="true">15.</strong> Send more messages at once</a></li><li class="chapter-item expanded affix "><li class="part-title">Using ctrl</li><li class="chapter-item expanded "><a href="usecase-ctrl-as-github-action-runner.html"><strong aria-hidden="true">16.</strong> ctrl as github action runner</a></li><li class="chapter-item expanded "><a href="usecase-ctrl-as-prometheus-collector.html"><strong aria-hidden="true">17.</strong> ctrl as prometheus collector</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString();
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
