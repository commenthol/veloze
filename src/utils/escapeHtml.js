const charMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
}

/**
 * escape HTML and prevent double escaping of '&'
 * @param {string} string - which requires escaping
 * @returns {string} escaped string
 * @example
 * escapeHTML('<h1>"One" & 'Two' &amp; Works</h1>')
 * // &lt;h1&gt;&quot;One&quot; &amp; &#39;Two&#39; &amp; Works&lt;/h1&gt;
 */
export const escapeHtml = string => String(string ?? '')
  .replace(/&amp;/g, '&')
  .replace(/[&<>'"]/g, tag => charMap[tag])

/**
 * Escape all vars in a template literal
 * @param {*} literals
 * @param  {...any} vars
 * @returns {string}
 * @example
 * escapeHtmlLit(`<h1>${"One" & 'Two' &amp; Works}</h1>`)
 * // <h1>&quot;One&quot; &amp; &#39;Two&#39; &amp; Works</h1>;
 */
export const escapeHtmlLit = (literals, ...vars) => literals
  .map((literal, i) => literal + escapeHtml(vars[i]))
  .join('')
