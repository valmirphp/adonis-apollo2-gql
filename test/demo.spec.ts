import * as test from "japa";

test.group("Grupo1", () => {
  test("add middleware", async assert => {
    assert.strictEqual("1", "1");
  });
});
