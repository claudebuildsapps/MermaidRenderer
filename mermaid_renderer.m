#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>

@interface MermaidRenderer : NSObject <NSApplicationDelegate>
@property (strong) NSWindow *window;
@property (strong) WKWebView *webView;
@property (strong) NSTextView *textView;
@property (strong) NSSplitView *splitView;
@end

@implementation MermaidRenderer

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
    [self createMainWindow];
    [self setupUI];
    [self loadDefaultDiagram];
}

- (void)createMainWindow {
    NSRect frame = NSMakeRect(100, 100, 1200, 800);
    
    self.window = [[NSWindow alloc] 
        initWithContentRect:frame
        styleMask:NSWindowStyleMaskTitled | 
                  NSWindowStyleMaskClosable | 
                  NSWindowStyleMaskMiniaturizable | 
                  NSWindowStyleMaskResizable
        backing:NSBackingStoreBuffered 
        defer:NO];
    
    [self.window setTitle:@"Mermaid Diagram Renderer"];
    [self.window makeKeyAndOrderFront:nil];
}

- (void)setupUI {
    // Create split view
    self.splitView = [[NSSplitView alloc] initWithFrame:self.window.contentView.bounds];
    self.splitView.autoresizingMask = NSViewWidthSizable | NSViewHeightSizable;
    self.splitView.vertical = YES;
    [self.window.contentView addSubview:self.splitView];
    
    // Create text input area
    NSScrollView *textScrollView = [[NSScrollView alloc] init];
    textScrollView.hasVerticalScroller = YES;
    
    self.textView = [[NSTextView alloc] init];
    self.textView.font = [NSFont fontWithName:@"SF Mono" size:14] ?: [NSFont systemFontOfSize:14];
    textScrollView.documentView = self.textView;
    
    // Create web view for rendering
    WKWebViewConfiguration *config = [[WKWebViewConfiguration alloc] init];
    self.webView = [[WKWebView alloc] initWithFrame:NSZeroRect configuration:config];
    
    // Add to split view
    [self.splitView addSubview:textScrollView];
    [self.splitView addSubview:self.webView];
    
    // Set initial split
    [self.splitView setPosition:400 ofDividerAtIndex:0];
    
    // Add render button
    NSButton *renderButton = [[NSButton alloc] init];
    renderButton.title = @"Render Diagram";
    renderButton.target = self;
    renderButton.action = @selector(renderDiagram:);
    
    [renderButton setTranslatesAutoresizingMaskIntoConstraints:NO];
    [self.window.contentView addSubview:renderButton];
    [NSLayoutConstraint activateConstraints:@[
        [renderButton.topAnchor constraintEqualToAnchor:self.window.contentView.topAnchor constant:10],
        [renderButton.centerXAnchor constraintEqualToAnchor:self.window.contentView.centerXAnchor]
    ]];
    
    [self.splitView setTranslatesAutoresizingMaskIntoConstraints:NO];
    [NSLayoutConstraint activateConstraints:@[
        [self.splitView.topAnchor constraintEqualToAnchor:renderButton.bottomAnchor constant:10],
        [self.splitView.leadingAnchor constraintEqualToAnchor:self.window.contentView.leadingAnchor],
        [self.splitView.trailingAnchor constraintEqualToAnchor:self.window.contentView.trailingAnchor],
        [self.splitView.bottomAnchor constraintEqualToAnchor:self.window.contentView.bottomAnchor]
    ]];
}

- (void)loadDefaultDiagram {
    NSString *defaultMermaid = @"graph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action 1]\n    B -->|No| D[Action 2]\n    C --> E[End]\n    D --> E";
    
    self.textView.string = defaultMermaid;
    [self renderDiagram:nil];
}

- (void)renderDiagram:(id)sender {
    NSString *mermaidCode = self.textView.string;
    NSString *htmlTemplate = [self createHTMLWithMermaidCode:mermaidCode];
    [self.webView loadHTMLString:htmlTemplate baseURL:nil];
}

- (NSString *)createHTMLWithMermaidCode:(NSString *)mermaidCode {
    return [NSString stringWithFormat:@"<!DOCTYPE html>\n<html>\n<head>\n<meta charset='utf-8'>\n<script src='https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js'></script>\n<style>body{font-family:sans-serif;margin:20px;background:#f5f5f5}.container{background:white;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1)}.mermaid{text-align:center}.zoom{position:fixed;top:10px;right:10px;background:white;padding:8px;border-radius:5px;box-shadow:0 2px 5px rgba(0,0,0,0.2)}.zoom button{margin:2px;padding:5px 8px;background:#007AFF;color:white;border:none;border-radius:3px;cursor:pointer}</style>\n</head>\n<body>\n<div class='zoom'>\n<button onclick='zoom(0.8)'>-</button>\n<span id='level'>100%%</span>\n<button onclick='zoom(1.25)'>+</button>\n<button onclick='reset()'>Reset</button>\n</div>\n<div class='container'>\n<div class='mermaid' id='diagram'>%@</div>\n</div>\n<script>\nlet scale=1;\nfunction zoom(f){scale*=f;document.getElementById('diagram').style.transform='scale('+scale+')';document.getElementById('level').textContent=Math.round(scale*100)+'%%';}\nfunction reset(){scale=1;document.getElementById('diagram').style.transform='scale(1)';document.getElementById('level').textContent='100%%';}\nmermaid.initialize({startOnLoad:true,theme:'default'});\n</script>\n</body>\n</html>", mermaidCode];
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)sender {
    return YES;
}

@end

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSApplication *app = [NSApplication sharedApplication];
        MermaidRenderer *renderer = [[MermaidRenderer alloc] init];
        [app setDelegate:renderer];
        [app run];
    }
    return 0;
}