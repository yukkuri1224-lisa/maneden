/**
 * JSON-LD 構造化データを <script> として出力する。
 * data はビルド時 / サーバー側で生成した信頼できる内容のみを渡すこと。
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
