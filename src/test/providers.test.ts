import { runQuickfixTest, outputGHCiLog } from './utils';


suite("ExtensionProvider", function () {
  test("Add missing import", () => {
    runQuickfixTest('ImportProvider.hs', 1,
      'Add: "import Data.List (sort)"',
      'Add: "import Data.Maybe"'
    );
  });

  test("Add missing import qualified", async () => {
    await runQuickfixTest('QualifiedImportProvider.hs', 1,
      'Add: "import qualified Data.ByteString as BS"'
    );
  });

  test("Organize imports", async () => {
    await runQuickfixTest('OrganizeImportProvider.hs', 1);
  });  

  test("Remove unused imports", async () => {
    await runQuickfixTest('UnusedImportProvider.hs', 1);
  });
  
  test("Add missing extension", async () => {
    await runQuickfixTest('ExtensionProvider.hs', 1);
  });

  test("Organize extensions", async () => {
    await runQuickfixTest('OrganizeExtensionProvider.hs', 1);
  });

  test("Replace wildcard with suggested type", async () => {
    await runQuickfixTest('TypeWildcardProvider.hs', 3);
  });

  test("Replace type hole with suggested type", async () => {
    await runQuickfixTest('TypeHoleProvider.hs', 2,
      "Fill `_' with: `True'",
      "Fill `_' with: `init'"
    );
  }); 
  
  test("Add top-level signature", async () => {
    await runQuickfixTest('TopLevelSignatureProvider.hs', 1);
  });
  

  teardown(async () => {
    if(this.ctx.currentTest.isFailed()) {
      await outputGHCiLog();
    }
  });
});
