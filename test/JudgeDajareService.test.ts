import { dajareWake } from "../src/app/service/JudgeDajareService";

describe("ダジャレ判定のテスト", () => {
  test("3文字以上のダジャレが含まれるとき、trueとなること", async () => {
    const result = await dajareWake("アルミ缶の上にあるみかん");
    expect(result).toBeTruthy();
  });
});
