# Makefile for Mermaid Renderer - Native macOS App

APP_NAME = MermaidRenderer
BUNDLE_ID = com.mermaid.renderer
VERSION = 1.0.0

# Compiler settings
CC = clang
CFLAGS = -Wall -Wextra -O2 -fobjc-arc
FRAMEWORKS = -framework Cocoa -framework WebKit -framework AppKit

# Source files
SOURCES = mermaid_renderer.m
OBJECTS = $(SOURCES:.m=.o)

# Paths
BUILD_DIR = build
APP_DIR = $(BUILD_DIR)/$(APP_NAME).app
CONTENTS_DIR = $(APP_DIR)/Contents
MACOS_DIR = $(CONTENTS_DIR)/MacOS
RESOURCES_DIR = $(CONTENTS_DIR)/Resources

.PHONY: all clean app install run

all: app

# Compile object files
%.o: %.m
	$(CC) $(CFLAGS) -c $< -o $@

# Build the executable
$(BUILD_DIR)/$(APP_NAME): $(OBJECTS) | $(BUILD_DIR)
	$(CC) $(CFLAGS) $(OBJECTS) $(FRAMEWORKS) -o $@

# Create app bundle
app: $(BUILD_DIR)/$(APP_NAME) | $(MACOS_DIR) $(RESOURCES_DIR)
	cp $(BUILD_DIR)/$(APP_NAME) $(MACOS_DIR)/
	./create_info_plist.sh $(CONTENTS_DIR) $(APP_NAME) $(BUNDLE_ID) $(VERSION)
	@echo "✅ App bundle created: $(APP_DIR)"

# Create necessary directories
$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

$(MACOS_DIR):
	mkdir -p $(MACOS_DIR)

$(RESOURCES_DIR):
	mkdir -p $(RESOURCES_DIR)

# Install to Applications (optional)
install: app
	cp -R $(APP_DIR) /Applications/
	@echo "✅ Installed to /Applications/$(APP_NAME).app"

# Run the app
run: app
	open $(APP_DIR)

# Clean build artifacts
clean:
	rm -rf $(BUILD_DIR) *.o

# Development shortcuts
dev: clean app run

# Show help
help:
	@echo "Mermaid Renderer Build System"
	@echo "============================="
	@echo "make all     - Build the app bundle"
	@echo "make app     - Same as 'all'"
	@echo "make install - Install to /Applications"
	@echo "make run     - Build and run the app"
	@echo "make dev     - Clean, build, and run"
	@echo "make clean   - Remove build artifacts"
	@echo "make help    - Show this help"