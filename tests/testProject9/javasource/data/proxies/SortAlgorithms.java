// This file was generated by Mendix Studio Pro.
//
// WARNING: Code you write here will be lost the next time you deploy the project.

package data.proxies;

public enum SortAlgorithms
{
	group(new java.lang.String[][] { new java.lang.String[] { "en_US", "group" } }),
	leafOrder(new java.lang.String[][] { new java.lang.String[] { "en_US", "leafOrder" } }),
	name(new java.lang.String[][] { new java.lang.String[] { "en_US", "name" } }),
	none(new java.lang.String[][] { new java.lang.String[] { "en_US", "none" } }),
	rcm(new java.lang.String[][] { new java.lang.String[] { "en_US", "rcm" } }),
	spectral(new java.lang.String[][] { new java.lang.String[] { "en_US", "spectral" } });

	private java.util.Map<java.lang.String, java.lang.String> captions;

	private SortAlgorithms(java.lang.String[][] captionStrings)
	{
		this.captions = new java.util.HashMap<java.lang.String, java.lang.String>();
		for (java.lang.String[] captionString : captionStrings)
			captions.put(captionString[0], captionString[1]);
	}

	public java.lang.String getCaption(java.lang.String languageCode)
	{
		if (captions.containsKey(languageCode))
			return captions.get(languageCode);
		return captions.get("en_US");
	}

	public java.lang.String getCaption()
	{
		return captions.get("en_US");
	}
}
